FROM golang:latest

WORKDIR /app

COPY . /app

RUN go build main.go

EXPOSE 9000

CMD ["./main"]

