// Code generated by protoc-gen-go-grpc. DO NOT EDIT.
// versions:
// - protoc-gen-go-grpc v1.2.0
// - protoc             v3.20.3
// source: echo.proto

package access

import (
	context "context"
	grpc "google.golang.org/grpc"
	codes "google.golang.org/grpc/codes"
	status "google.golang.org/grpc/status"
)

// This is a compile-time assertion to ensure that this generated file
// is compatible with the grpc package it is being compiled against.
// Requires gRPC-Go v1.32.0 or later.
const _ = grpc.SupportPackageIsVersion7

// AccessClient is the client API for Access service.
//
// For semantics around ctx use and closing/ending streaming RPCs, please refer to https://pkg.go.dev/google.golang.org/grpc/?tab=doc#ClientConn.NewStream.
type AccessClient interface {
	AccessCheck(ctx context.Context, in *AccessRequest, opts ...grpc.CallOption) (*AccessResponse, error)
	Echo(ctx context.Context, in *AccessRequest, opts ...grpc.CallOption) (*AccessResponse, error)
}

type accessClient struct {
	cc grpc.ClientConnInterface
}

func NewAccessClient(cc grpc.ClientConnInterface) AccessClient {
	return &accessClient{cc}
}

func (c *accessClient) AccessCheck(ctx context.Context, in *AccessRequest, opts ...grpc.CallOption) (*AccessResponse, error) {
	out := new(AccessResponse)
	err := c.cc.Invoke(ctx, "/access.Access/AccessCheck", in, out, opts...)
	if err != nil {
		return nil, err
	}
	return out, nil
}

func (c *accessClient) Echo(ctx context.Context, in *AccessRequest, opts ...grpc.CallOption) (*AccessResponse, error) {
	out := new(AccessResponse)
	err := c.cc.Invoke(ctx, "/access.Access/Echo", in, out, opts...)
	if err != nil {
		return nil, err
	}
	return out, nil
}

// AccessServer is the server API for Access service.
// All implementations must embed UnimplementedAccessServer
// for forward compatibility
type AccessServer interface {
	AccessCheck(context.Context, *AccessRequest) (*AccessResponse, error)
	Echo(context.Context, *AccessRequest) (*AccessResponse, error)
	mustEmbedUnimplementedAccessServer()
}

// UnimplementedAccessServer must be embedded to have forward compatible implementations.
type UnimplementedAccessServer struct {
}

func (UnimplementedAccessServer) AccessCheck(context.Context, *AccessRequest) (*AccessResponse, error) {
	return nil, status.Errorf(codes.Unimplemented, "method AccessCheck not implemented")
}
func (UnimplementedAccessServer) Echo(context.Context, *AccessRequest) (*AccessResponse, error) {
	return nil, status.Errorf(codes.Unimplemented, "method Echo not implemented")
}
func (UnimplementedAccessServer) mustEmbedUnimplementedAccessServer() {}

// UnsafeAccessServer may be embedded to opt out of forward compatibility for this service.
// Use of this interface is not recommended, as added methods to AccessServer will
// result in compilation errors.
type UnsafeAccessServer interface {
	mustEmbedUnimplementedAccessServer()
}

func RegisterAccessServer(s grpc.ServiceRegistrar, srv AccessServer) {
	s.RegisterService(&Access_ServiceDesc, srv)
}

func _Access_AccessCheck_Handler(srv interface{}, ctx context.Context, dec func(interface{}) error, interceptor grpc.UnaryServerInterceptor) (interface{}, error) {
	in := new(AccessRequest)
	if err := dec(in); err != nil {
		return nil, err
	}
	if interceptor == nil {
		return srv.(AccessServer).AccessCheck(ctx, in)
	}
	info := &grpc.UnaryServerInfo{
		Server:     srv,
		FullMethod: "/access.Access/AccessCheck",
	}
	handler := func(ctx context.Context, req interface{}) (interface{}, error) {
		return srv.(AccessServer).AccessCheck(ctx, req.(*AccessRequest))
	}
	return interceptor(ctx, in, info, handler)
}

func _Access_Echo_Handler(srv interface{}, ctx context.Context, dec func(interface{}) error, interceptor grpc.UnaryServerInterceptor) (interface{}, error) {
	in := new(AccessRequest)
	if err := dec(in); err != nil {
		return nil, err
	}
	if interceptor == nil {
		return srv.(AccessServer).Echo(ctx, in)
	}
	info := &grpc.UnaryServerInfo{
		Server:     srv,
		FullMethod: "/access.Access/Echo",
	}
	handler := func(ctx context.Context, req interface{}) (interface{}, error) {
		return srv.(AccessServer).Echo(ctx, req.(*AccessRequest))
	}
	return interceptor(ctx, in, info, handler)
}

// Access_ServiceDesc is the grpc.ServiceDesc for Access service.
// It's only intended for direct use with grpc.RegisterService,
// and not to be introspected or modified (even as a copy)
var Access_ServiceDesc = grpc.ServiceDesc{
	ServiceName: "access.Access",
	HandlerType: (*AccessServer)(nil),
	Methods: []grpc.MethodDesc{
		{
			MethodName: "AccessCheck",
			Handler:    _Access_AccessCheck_Handler,
		},
		{
			MethodName: "Echo",
			Handler:    _Access_Echo_Handler,
		},
	},
	Streams:  []grpc.StreamDesc{},
	Metadata: "echo.proto",
}