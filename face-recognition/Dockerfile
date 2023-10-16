FROM python:3.9

WORKDIR /app

COPY ./requirements.txt /app/requirements.txt

RUN pip install --no-cache-dir -r requirements.txt

COPY . /app

EXPOSE 5000

CMD ["python", "recognition.py"]