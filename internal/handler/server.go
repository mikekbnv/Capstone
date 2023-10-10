package handlers

import (
	"bytes"
	"context"
	"errors"
	"fmt"
	"log"
	"net"
	"strconv"

	"github.com/mikekbnv/grpc-react-web/database"
	pb "github.com/mikekbnv/grpc-react-web/goclient"
	"github.com/mikekbnv/grpc-react-web/internal/types"
	"github.com/mikekbnv/grpc-react-web/internal/utils"
	"google.golang.org/grpc"
	"google.golang.org/grpc/reflection"
	"gorm.io/gorm"
)

var (
	listenAddress = "0.0.0.0:9000"
)

type server struct {
	pb.UnimplementedAccessServer
}

func (s *server) ListEmployee(ctx context.Context, req *pb.ListEmployeeRequest) (*pb.ListEmployeeResponse, error) {
	//list employee logic
	employees := []types.Employee{}
	database.DB.Db.Find(&employees)
	resp := &pb.ListEmployeeResponse{}
	data := []*pb.Employee{}
	for _, employee := range employees {
		data = append(data, &pb.Employee{
			Id:    int32(employee.Id),
			Fname: employee.First_Name,
			Lname: employee.Last_Name,
		})
	}
	resp.Employees = data
	return resp, nil

}
func (s *server) AddEmployee(ctx context.Context, req *pb.EmployeeRequest) (*pb.EmployeeResponse, error) {
	//add employee logic
	employee := new(types.Employee)
	employee.First_Name = req.Employee.GetFname()
	employee.Last_Name = req.Employee.GetLname()

	database.DB.Db.Create(&employee)
	fmt.Println(employee.Id)
	return &pb.EmployeeResponse{Id: int32(employee.Id)}, nil

}
func (s *server) AccessCheck(ctx context.Context, req *pb.EntranceRequest) (*pb.Response, error) {
	var buffer bytes.Buffer
	_, err := buffer.Write(req.Chunk)
	if err != nil {
		return &pb.Response{}, err
	}
	err = utils.SaveToFile("data", req.FileName, buffer.Bytes())
	if err != nil {
		return &pb.Response{}, err
	}

	id, err := strconv.Atoi(req.Id)
	if err := database.DB.Db.First(&types.Employee{Id: id}).Error; errors.Is(err, gorm.ErrRecordNotFound) {
		return &pb.Response{Access: false}, nil
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
