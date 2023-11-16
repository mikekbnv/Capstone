#!/bin/python3
# FROM python:3.9-slim

# # Install system dependencies
# RUN apt-get update && apt-get install -y --no-install-recommends \
#     build-essential \
#     cmake \
#     libopenblas-dev \
#     libjpeg-dev \
#     zlib1g-dev \ 
#     git

# # Install numpy
# RUN pip install numpy

# # Clone dlib repository
# RUN git clone https://github.com/davisking/dlib.git

# # Build and install dlib
# RUN mkdir -p dlib/build && cd dlib/build && cmake .. && cmake --build .
# RUN cd dlib && python setup.py install

# # Copy only the requirements.txt first to leverage Docker cache
# COPY ./requirements.txt /app/requirements.txt

# # Install any other dependencies required by your application
# # Use pip's fast-deps feature to resolve and install dependencies in parallel
# RUN pip install -r /app/requirements.txt --use-feature=fast-deps

# # Copy your application code to the container
# COPY . /app
# WORKDIR /app

# EXPOSE 5000
# # Set the entrypoint command to run your application
# CMD ["python", "recognition.py"]
FROM python:3.9-slim

# Install system dependencies
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    cmake \
    libopenblas-dev \
    libjpeg-dev \
    zlib1g-dev

# Copy your application code to the container
COPY . /app
WORKDIR /app

# Install any other dependencies required by your application
RUN pip install -r requirements.txt

EXPOSE 5000
# Set the entrypoint command to run your application
CMD ["python", "recognition.py"]

