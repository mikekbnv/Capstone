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
FROM python:3.9-slim

RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    cmake \
    libopenblas-dev \
    libjpeg-dev \
    zlib1g-dev

COPY . /app
WORKDIR /app

RUN pip install -r requirements.txt

EXPOSE 5000

CMD ["python", "recognition.py"]

