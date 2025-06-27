from flask import Blueprint, request, jsonify, send_file, current_app
from ultralytics import YOLO
import cv2
import os
import uuid

predict_bp = Blueprint('predict', __name__)
model = YOLO('vegan_model.pt')
UPLOAD_FOLDER = 'uploads'
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

@predict_bp.record_once
def setup_state(state):
    app = state.app
    predict_bp.db = app.config['db']
    predict_bp.cursor = app.config['cursor']

@predict_bp.route('/predict', methods=['POST'])
def predict():
    if 'image' not in request.files:
        return jsonify({'success': False, 'message': 'No image provided.'}), 400

    image_file = request.files['image']
    original_filename = f"{uuid.uuid4().hex}.jpg"
    original_path = os.path.join(UPLOAD_FOLDER, original_filename)
    image_file.save(original_path)

    # YOLOv8 inference
    results = model(original_path)
    result = results[0]

    # Annotated image
    annotated_img = result.plot()
    result_filename = f"pred_{uuid.uuid4().hex}.jpg"
    result_path = os.path.join(UPLOAD_FOLDER, result_filename)
    cv2.imwrite(result_path, annotated_img)

    # Class labels
    labels = list(set([model.names[int(cls)] for cls in result.boxes.cls]))

    # Classification logic
    non_vegan_items = {'meat', 'egg', 'dairy'}
    is_non_vegan = any(label.lower() in non_vegan_items for label in labels)
    classification = 'Non-Vegan' if is_non_vegan else 'Vegan'

    # Save to database
    try:
        cursor = predict_bp.cursor
        db = predict_bp.db
        user_id = request.form.get('userId')

        cursor.execute("""
            INSERT INTO predictions (user_id, image_path, result_image_path, labels, result)
            VALUES (%s, %s, %s, %s, %s)
        """, (user_id, original_filename, result_filename, ','.join(labels), classification))

        db.commit()
        prediction_id = cursor.lastrowid

    except Exception as e:
        print("DB insert error:", e)
        return jsonify({'success': False, 'message': 'Database error.'}), 500

    return jsonify({
        'success': True,
        'labels': labels,
        'classification': classification,
        'imagePath': result_filename,  # frontend will display this
        'predictionId': prediction_id
    })

@predict_bp.route('/image/<path:filename>')
def get_image(filename):
    return send_file(os.path.join(UPLOAD_FOLDER, filename), mimetype='image/jpeg')
