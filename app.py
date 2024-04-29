from flask import Flask, render_template, request, jsonify
from werkzeug.utils import secure_filename
import numpy as np
from tensorflow.keras.preprocessing import image
from tensorflow.keras.models import load_model

app = Flask(__name__)

# Load the trained model
model = load_model("myelitis.h5")
IMAGE_SIZE = (224, 224)

def predict_image(img_path):
    # Load and preprocess the image
    img = image.load_img(img_path, target_size=IMAGE_SIZE)
    img_array = image.img_to_array(img)
    img_array = np.expand_dims(img_array, axis=0)
    img_array = img_array / 255.0

    # Make prediction
    prediction = model.predict(img_array)
    
    # Check the prediction
    if prediction[0][0] > 0.5:
        return "The model predicts that the image contains myelitis disease."
    else:
        return "The model predicts that the image does not contain myelitis disease."

@app.route('/')
def home():
    return render_template('index.html')

@app.route('/predict', methods=['POST'])
def predict():
    if request.method == 'POST':
        # Check if the post request has the file part
        if 'file' not in request.files:
            return jsonify({'error': 'No file part'})
        
        file = request.files['file']
        
        # If the user does not select a file, browser submits an empty file without a filename
        if file.filename == '':
            return jsonify({'error': 'No selected file'})
        
        if file:
            # Secure the filename
            filename = secure_filename(file.filename)
            # Save the file to the uploads directory
            file_path = "uploads/" + filename
            file.save(file_path)
            # Make prediction
            prediction = predict_image(file_path)
            return jsonify({'prediction': prediction})

if __name__ == '__main__':
    app.run(debug=True)
