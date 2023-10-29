FROM golang:latest

WORKDIR /app

COPY ./.env .
COPY  ./main .


EXPOSE 9000

CMD ["./main"]

