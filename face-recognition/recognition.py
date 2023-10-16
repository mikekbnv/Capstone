from flask import Flask, render_template
import redis
import base64

app = Flask(__name__, template_folder='templates')

r = redis.Redis(host='redis', port=6379, db=0)

@app.route('/')
def display_images():
    
    image_data_list = r.lrange('36-photos', 0, -1)

    encoded_images = []
    for img_data in image_data_list:
        encoded_image = base64.b64encode(img_data).decode('utf-8')
        encoded_images.append(encoded_image)
        #print(encoded_image)

    return render_template('index.html', images=encoded_images)

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)
