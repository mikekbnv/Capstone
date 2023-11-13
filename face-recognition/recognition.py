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
    # try:
        data = request.get_json()
        #print(data, file=sys.stderr)
        id = data.get("Id", None)  
        image = data.get("Image", None)
        print(str(id) + '-photos',file=sys.stderr)
        image_bytes = base64.b64decode(image)
        print(type(image_bytes) , file=sys.stderr)
        with open(f"{str(id)}-a.jpg", "wb") as file:
            file.write(image_bytes)
        
        image_data_list = r.lrange(str(id) + '-photos', 0, id - 1)
        
        encoded_images = []
        
        print(len(image_data_list), file=sys.stderr)
        for img_data in image_data_list[::-1]:
            encoded_image = base64.b64decode(img_data)
            print(type(encoded_image), file=sys.stderr)
            with open(f"{str(id)}-b.jpg", "wb") as file:
                file.write(encoded_image)
            #encoded_images.append(encoded_image)
            break
        
       
        # image_a = base64.b64decode(image)
        image_a = face_recognition.load_image_file(f"{str(id)}-a.jpg")
        # #image_a_rgb = cv2.cvtColor(image_a, cv2.COLOR_BGR2RGB)
        
        # image_b = base64.b64decode(encoded_images[0])
        image_b = face_recognition.load_image_file(f"{str(id)}-b.jpg")
        # #image_b_rgb = cv2.cvtColor(image_b, cv2.COLOR_BGR2RGB)
        
        face_encoding_a = face_recognition.face_encodings(image_a)[0]
        face_encoding_b = face_recognition.face_encodings(image_b)[0]
        
        results = face_recognition.compare_faces([face_encoding_a], face_encoding_b, )
        print(results, file=sys.stderr)
        # os.remove(f"{str(id)}-a.jpg")
        # os.remove(f"{str(id)}-b.jpg")
        if results[0]:
            return jsonify({"message": "OK"})
        else:
            return jsonify({"message": "Not Ok"})
    # except Exception as e:
    #     return jsonify({"error": str(e)}), 400
    # image_data = request.form['photo']
    # id = int(request.form['num'])
    # image_data_list = r.lrange(str(id) + '-photos', 0, id - 1)
    # print(str(id) + '-photos')
    # encoded_images = []
    # for img_data in image_data_list:
    #     encoded_image = base64.b64encode(img_data).decode('utf-8')
    #     encoded_images.append(encoded_image)
    # return 'OK'



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
    #hostaddr = os.getenv('HOSTADDR')
    #app.run(debug=True, host=hostaddr, port=5000)
    app.run(debug=True, host='0.0.0.0', port=5000)
