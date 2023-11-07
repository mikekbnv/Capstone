from flask import Flask, render_template, request, jsonify
import redis
import base64
import os
from dotenv import load_dotenv

#load_dotenv()
app = Flask(__name__, template_folder='templates')
r = redis.Redis(host='redis', port=6379, db=0)

@app.route('/')
def home():
    return render_template('index.html')

@app.route('/check', methods=['POST'])
def check():
    try:
        data = request.get_json()
        id = data.get("Id", None)  
        image = data.get("Image", None)
        print(id)
        # print(image)
       

        return jsonify({"message": "OK"})
    except Exception as e:
        return jsonify({"error": str(e)}), 400
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
    num_images = int(request.form['num'])

    image_data_list = r.lrange(str(num_images) + '-photos', 0, num_images - 1)
    print(str(num_images) + '-photos')
    encoded_images = []
    for img_data in image_data_list:
        encoded_image = base64.b64encode(img_data).decode('utf-8')
        encoded_images.append(encoded_image)

    return render_template('index.html', images=encoded_images)

if __name__ == '__main__':
    #hostaddr = os.getenv('HOSTADDR')
    #app.run(debug=True, host=hostaddr, port=5000)
    app.run(debug=True, host='0.0.0.0', port=5000)
