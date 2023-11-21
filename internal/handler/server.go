package handlers

import (
	"bytes"
	"context"
	"encoding/base64"
	"encoding/json"
	"errors"
	"fmt"
	"log"
	"net"
	"net/http"
	"os"
	"time"

	"github.com/joho/godotenv"
	"github.com/mikekbnv/grpc-react-web/database"
	pb "github.com/mikekbnv/grpc-react-web/goclient"
	"github.com/mikekbnv/grpc-react-web/internal/types"
	"github.com/mikekbnv/grpc-react-web/internal/utils"
	"google.golang.org/grpc"
	"google.golang.org/grpc/reflection"
	"gorm.io/gorm"
)

type server struct {
	pb.UnimplementedAccessServer
}

// Sent the list of employees to the client from the database
func (s *server) ListEmployees(ctx context.Context, req *pb.EmptyRequest) (*pb.ListEmployeesResponse, error) {

	employees := []types.Employee{}
	database.DB.Db.Find(&employees)
	resp := &pb.ListEmployeesResponse{}
	data := []*pb.Employee{}
	for _, employee := range employees {
		data = append(data, &pb.Employee{
			Id:       int32(employee.Id),
			Fname:    employee.First_Name,
			Lname:    employee.Last_Name,
			Position: employee.Role,
		})
	}
	resp.Employees = data
	return resp, nil

}

// Add a new employee to the database 
func (s *server) AddEmployee(ctx context.Context, req *pb.EmployeeRequest) (*pb.EmployeeResponse, error) {

	employee := new(types.Employee)
	employee.First_Name = req.Employee.GetFname()
	employee.Last_Name = req.Employee.GetLname()
	employee.Role = req.Employee.GetPosition()
	var photo bytes.Buffer
	_, err := photo.Write(req.Employee.GetPhoto())
	if err != nil {
		return &pb.EmployeeResponse{}, err
	}

	database.DB.Db.Create(&employee)
	err = utils.SaveToFile("data", fmt.Sprintf("%d.jpg", employee.Id), photo.Bytes())
	if err != nil {
		return &pb.EmployeeResponse{}, err
	}
	err = database.RDB.LPush(ctx, fmt.Sprintf("%d-photos", employee.Id), base64.StdEncoding.EncodeToString(photo.Bytes())).Err()
	if err != nil {
		panic(err)
	}
	return &pb.EmployeeResponse{Id: int32(employee.Id)}, nil

}

// Delete an employee from the database
func (s *server) DeleteEmployee(ctx context.Context, req *pb.DeleteEmployeeRequest) (*pb.EmptyResponse, error) {

	employee := new(types.Employee)
	employee.Id = int32(req.GetId())
	database.DB.Db.Delete(&employee)
	err := database.RDB.Del(ctx, fmt.Sprintf("%d-photos", employee.Id)).Err()
	if err != nil {
		panic(err)
	}
	return &pb.EmptyResponse{}, nil
}


// If the person is in the database and the picture is the same person, than add the picture to the database and add the visit log to the database
func (s *server) AccessCheck(ctx context.Context, req *pb.EntranceRequest) (*pb.Response, error) {
	var buffer bytes.Buffer
	_, err := buffer.Write(req.Chunk)
	if err != nil {
		return &pb.Response{Access: false}, err
	}

	id := req.Id
	if err := database.DB.Db.First(&types.Employee{Id: id}).Error; errors.Is(err, gorm.ErrRecordNotFound) {
		return &pb.Response{Access: false}, nil
	}

	var visit_log types.Visit_log
	_ = database.DB.Db.Where("employee_id = ?", id).Last(&visit_log)

	if visit_log.Status == "in" {
		return &pb.Response{Access: false}, nil
	}
	var entrance_log types.Visit_log
	entrance_log.Employee_id = int(id)
	entrance_log.Status = "in"
	entrance_log.Date = time.Now()

	data := map[string]interface{}{
		"Image": base64.StdEncoding.EncodeToString(buffer.Bytes()),
		"Id":    id,
	}

	payload, err := json.Marshal(data)
	if err != nil {
		return &pb.Response{Access: false}, nil
	}

	check, err := http.Post("http://face-recognition:5000/check", "application/json", bytes.NewBuffer(payload))
	if err != nil {
		log.Println(err)
		return &pb.Response{Access: false}, nil
	}

	defer check.Body.Close()
	var result map[string]interface{}
	json.NewDecoder(check.Body).Decode(&result)
	log.Println(result)

	if result["message"] == "OK" {
		err = database.RDB.LPush(ctx, fmt.Sprintf("%d-photos", req.GetId()), base64.StdEncoding.EncodeToString(buffer.Bytes())).Err()
		if err != nil {
			panic(err)
		}
		database.DB.Db.Create(&entrance_log)
		return &pb.Response{Access: true}, nil
	}

	return &pb.Response{Access: false}, nil
}

// Provide exit from the office only if the person is in the database and has not yet left the office
func (s *server) ExitCheck(ctx context.Context, req *pb.ExitRequest) (*pb.Response, error) {
	id := req.Id
	if err := database.DB.Db.First(&types.Employee{Id: id}).Error; errors.Is(err, gorm.ErrRecordNotFound) {
		return &pb.Response{Access: false}, nil
	}

	var visit_log types.Visit_log
	_ = database.DB.Db.Where("employee_id = ?", id).Last(&visit_log)
	
	if visit_log.Status == "out" || visit_log.Status == ""{
		return &pb.Response{Access: false}, nil
	}
	var exit_log types.Visit_log
	exit_log.Employee_id = int(id)
	exit_log.Status = "out"
	exit_log.Date = time.Now()

	database.DB.Db.Create(&exit_log)

	return &pb.Response{Access: true}, nil
}

// Start the backend grpc server
func RunServer() {
	err := godotenv.Load(".env")
	if err != nil {
		log.Fatalf("Error loading .env file")
	}
	listenAddress := fmt.Sprintf("%s:%s", os.Getenv("HOSTADDR"), "9000")
	lis, err := net.Listen("tcp", listenAddress)

	if err != nil {
		log.Fatalf("failed to listen: %v", err)
	}

	s := grpc.NewServer()
	reflection.Register(s)
	pb.RegisterAccessServer(s, &server{})

	log.Printf("server listening at %v", lis.Addr())
	if err := s.Serve(lis); err != nil {
		log.Fatalf("failed to serve: %v", err)
	}
}
