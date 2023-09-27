package main

import (
	"bytes"
	"context"
	"log"
	"net"
	"os"
	"path/filepath"

	pb "github.com/mikekbnv/grpc-react-web/goclient"
	"google.golang.org/grpc"
	"google.golang.org/grpc/reflection"
)

var (
	listenAddress = "0.0.0.0:9000"
)

type server struct {
	pb.UnimplementedAccessServer
}

// func (s *server) Echo(ctx context.Context, n *pb.AccessRequest) (*pb.AccessResponse, error) {
// 	log.Printf("Recieved a msg: %v", n.Id)
// 	return &pb.AccessResponse{Access: true}, nil
// }

func (s *server) AccessCheck(ctx context.Context, req *pb.EntranceRequest) (*pb.Response, error) {
	var buffer bytes.Buffer
	_, err := buffer.Write(req.Chunk)
	if err != nil {
		return &pb.Response{}, err
	}
	err = saveToFile("data", req.FileName, buffer.Bytes())
	if err != nil {
		return &pb.Response{}, err
	}
	//TODO: access check logic
	return &pb.Response{Access: true}, nil
}
func (s *server) ExitCheck(ctx context.Context, req *pb.ExitRequest) (*pb.Response, error) {
	//TODO: exit check logic
	log.Printf("Recieved a msg: %v", req.Id)
	return &pb.Response{Access: true}, nil
}

func saveToFile(folderPath, fileName string, data []byte) error {
	//file, err := os.Create(filepath.Join(folderPath, filepath.Base(fileName)))
	filePath := filepath.Join(folderPath, fileName)
	file, err := os.Create(filePath)
	if err != nil {
		return err
	}
	defer file.Close()

	_, err = file.Write(data)
	if err != nil {
		return err
	}

	return nil
}
func main() {

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
