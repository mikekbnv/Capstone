# FROM animcogn/face_recognition

# WORKDIR /app

# COPY ./requirements.txt /app/requirements.txt

# RUN pip3 install -r requirements.txt

# COPY . /app

# EXPOSE 5000

# CMD ["python3", "recognition.py"]

FROM python:3.9-slim-buster

# Install system dependencies
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    cmake \
    libopenblas-dev \
    libjpeg-dev \
    zlib1g-dev

# Install dlib using pre-built binaries
RUN pip install dlib

# Copy your application code to the container
COPY . /app
WORKDIR /app

# Install any other dependencies required by your application
RUN pip3 install -r requirements.txt

# Set the entrypoint command to run your application
CMD ["python3", "recognition.py"]

