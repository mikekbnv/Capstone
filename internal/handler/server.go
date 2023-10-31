package handlers

import (
	"bytes"
	"context"
	"encoding/json"
	"errors"
	"fmt"
	"log"
	"net"
	"net/http"
	"os"

	"github.com/joho/godotenv"
	"github.com/mikekbnv/grpc-react-web/database"
	pb "github.com/mikekbnv/grpc-react-web/goclient"
	"github.com/mikekbnv/grpc-react-web/internal/types"
	"github.com/mikekbnv/grpc-react-web/internal/utils"
	"google.golang.org/grpc"
	"google.golang.org/grpc/reflection"
	"gorm.io/gorm"
)

// var (
// 	listenAddress = "0.0.0.0:9000"
// )

type server struct {
	pb.UnimplementedAccessServer
}

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
	err = database.RDB.LPush(ctx, fmt.Sprintf("%d-photos", employee.Id), photo.Bytes()).Err()
	if err != nil {
		panic(err)
	}
	return &pb.EmployeeResponse{Id: int32(employee.Id)}, nil

}
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

func (s *server) AccessCheck(ctx context.Context, req *pb.EntranceRequest) (*pb.Response, error) {
	var buffer bytes.Buffer
	_, err := buffer.Write(req.Chunk)
	if err != nil {
		return &pb.Response{}, err
	}
	// err = utils.SaveToFile("data", req.FileName, buffer.Bytes())
	// if err != nil {
	// 	return &pb.Response{}, err
	// }
	id := req.Id
	if err := database.DB.Db.First(&types.Employee{Id: id}).Error; errors.Is(err, gorm.ErrRecordNotFound) {
		return &pb.Response{Access: false}, nil
	}

	fmt.Println("testing")

	data := map[string]interface{}{
		"photo": buffer.String(),
		"id":    id,
	}

	payload, err := json.Marshal(data)
	if err != nil {
		fmt.Println("Error:", err)
		return &pb.Response{Access: false}, nil
	}

	check, err := http.Post("http://face-recognition:5000/check", "application/json", bytes.NewBuffer(payload))
	if err != nil {
		fmt.Println("Error:", err)
		return &pb.Response{Access: false}, nil
	}

	defer check.Body.Close()
	var result map[string]interface{}
	json.NewDecoder(check.Body).Decode(&result)
	fmt.Println(result)

	err = database.RDB.LPush(ctx, fmt.Sprintf("%d-photos", req.GetId()), buffer.Bytes()).Err()
	if err != nil {
		panic(err)
	}

	//TODO: access check logic
	return &pb.Response{Access: true}, nil
}
func (s *server) ExitCheck(ctx context.Context, req *pb.ExitRequest) (*pb.Response, error) {
	//TODO: exit check logic
	log.Printf("Recieved a msg: %v", req.Id)
	return &pb.Response{Access: true}, nil
}

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
