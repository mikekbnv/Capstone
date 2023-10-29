#compile go 
GOOS=linux GOARCH=amd64 go build main.go

#build frontend
cd frontend
npm install
npm run build