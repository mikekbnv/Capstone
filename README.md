# Multi-factor Authentication for Office Space

## Overview

This project aims to enhance security and efficiency within office environments by implementing a multi-factor authentication system. Using a combination of RFID and facial recognition technologies, the system efficiently manages and monitors the entry and exit of employees, thus providing insights into employee presence and working hours, and eliminating the need for manual checks.

## Key Technologies

- **Golang:** The primary programming language used for development.
- **gRPC:** Used for creating efficient, high-performance APIs.
- **Python and Face-Recognition Library:** Used for developing the facial recognition service.
- **Redis and PostgreSQL:** Employed as the database layer for storing and managing data.
- **React:** Utilized for creating the client-side interface.
- **Envoy:** Facilitates secure communication by converting HTTPS to gRPC.
- **Docker and Docker Compose:** Used for defining and running the multi-container Docker applications.

## Installation

To install the project, follow the steps below:

1. Clone the repository to your local machine.
2. Ensure Docker is installed on your machine.
3. Navigate to the project directory and execute `docker-compose build`.
4. Once the build process is complete, run `docker-compose up`.

## Usage

The system provides two key functionalities: 

- **For Administrators:** Administrators can add employees to the system. To do this, navigate to the admin panel, go to 'Add Employee', and create the employee's profile.
  
- **For Employees:** Employees can authenticate themselves using their ID and face recognition. To do this, navigate to the employee panel, then 'Entrance'. Provide your ID and take a picture of yourself. The system will then validate the information and grant/deny access accordingly.
