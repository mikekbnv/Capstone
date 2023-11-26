from flask import Flask, render_template, request, jsonify
import redis
import base64
import os
import sys
from dotenv import load_dotenv
import face_recognition
import io


#load_dotenv()
app = Flask(__name__, template_folder='templates')
r = redis.Redis(host='redis', port=6379, db=0)

@app.route('/')
def home():
    return render_template('index.html')

@app.route('/check', methods=['POST'])
def check():
        data = request.get_json()
        id = data.get("Id", None)  
        image = data.get("Image", None)
        print(str(id) + '-photos',file=sys.stderr)
        image_bytes = base64.b64decode(image)
        print(type(image_bytes) , file=sys.stderr)
        with open(f"{str(id)}-a.jpg", "wb") as file:
            file.write(image_bytes)

        image_data_list = r.lrange(str(id) + '-photos', 0, id - 1)
    
        print(len(image_data_list), file=sys.stderr)
        for img_data in image_data_list[::-1]:
            encoded_image = base64.b64decode(img_data)
            print(type(encoded_image), file=sys.stderr)
            with open(f"{str(id)}-b.jpg", "wb") as file:
                file.write(encoded_image)
            break
         
        image_a = face_recognition.load_image_file(f"{str(id)}-a.jpg")
       
        image_b = face_recognition.load_image_file(f"{str(id)}-b.jpg")
       
        
        face_encoding_a = face_recognition.face_encodings(image_a)[0]
        face_encoding_b = face_recognition.face_encodings(image_b)[0]
        
        results = face_recognition.compare_faces([face_encoding_a], face_encoding_b)
       
        if results[0]:
            return jsonify({"message": "OK"})
        else:
            return jsonify({"message": "Not Ok"})

@app.route('/display', methods=['POST'])
def display_images():
    id = int(request.form['num'])

    image_data_list = r.lrange(str(id) + '-photos', 0, id - 1)
    encoded_images = []
    for img_data in image_data_list:
        decoded_image = base64.b64decode(img_data)
        encoded_image = base64.b64encode(decoded_image).decode('utf-8')
        encoded_images.append(encoded_image)
    

    return render_template('index.html', images=encoded_images)

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)
