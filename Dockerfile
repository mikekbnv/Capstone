FROM golang:latest

WORKDIR /app

COPY  . ./

RUN go build main.go

EXPOSE 9000

CMD ["./main"]

