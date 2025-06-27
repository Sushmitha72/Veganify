from flask import Flask, request, jsonify 
from flask_cors import CORS
import mysql.connector
import re
import pymysql

from predict import predict_bp  # Import the blueprint

from admin_routes import admin_bp

from recommender.recommendation_routes import recommendation_bp

app = Flask(__name__)
CORS(app)


# MySQL configuration
db = mysql.connector.connect(
    host="localhost",
    user="root",
    password="",
    database="vegan_classification"
)
cursor = db.cursor(dictionary=True)

# Create table if not exists
cursor.execute("""
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    userName VARCHAR(255),
    email VARCHAR(255) UNIQUE,
    password VARCHAR(255)
)
""")
db.commit()

# Validators
def is_valid_email(email):
    return re.match(r"[^@]+@[^@]+\.[^@]+", email)

def is_valid_password(password):
    return len(password) >= 6 and any(c.isdigit() for c in password) and any(c.isalpha() for c in password)

# Register endpoint
@app.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    userName = data.get('userName')
    email = data.get('email')
    password = data.get('password')

    if not is_valid_email(email):
        return jsonify(success=False, message="Invalid email")
    if not is_valid_password(password):
        return jsonify(success=False, message="Password must be at least 6 characters long and contain letters and numbers")

    try:
        cursor.execute("INSERT INTO users (userName, email, password) VALUES (%s, %s, %s)", (userName, email, password))
        db.commit()
        return jsonify(success=True, message="Registered successfully")
    except mysql.connector.IntegrityError:
        return jsonify(success=False, message="Email already exists")

# Login endpoint
@app.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')

    # ✅ Hardcoded Admin Check
    if email == 'admin@gmail.com' and password == 'Admin@123':
        return jsonify(success=True, user={
            "id": 0,
            "userName": "Admin",
            "email": email,
            "role": "admin"
        })

    # ✅ Check in users table for normal users
    cursor.execute("SELECT * FROM users WHERE email = %s AND password = %s", (email, password))
    user = cursor.fetchone()

    if user:
        return jsonify(success=True, user={
            "id": user["id"],
            "userName": user["userName"],
            "email": user["email"],
            "role": "user"
        })
    else:
        return jsonify(success=False, message="Invalid credentials")


# Reset password
@app.route('/reset-password', methods=['POST'])
def reset_password():
    data = request.get_json()
    email = data.get('email')
    new_password = data.get('password')

    if not is_valid_email(email):
        return jsonify(success=False, message="Invalid email")
    if not is_valid_password(new_password):
        return jsonify(success=False, message="Weak password")

    cursor.execute("SELECT * FROM users WHERE email = %s", (email,))
    user = cursor.fetchone()

    if user:
        cursor.execute("UPDATE users SET password = %s WHERE email = %s", (new_password, email))
        db.commit()
        return jsonify(success=True, message="Password reset successful")
    else:
        return jsonify(success=False, message="User not found")

# ✅ View profile endpoint
@app.route('/profile/<email>', methods=['GET'])
def view_profile(email):
    if not is_valid_email(email):
        return jsonify(success=False, message="Invalid email format")

    cursor.execute("SELECT userName, email FROM users WHERE email = %s", (email,))
    user = cursor.fetchone()

    if user:
        return jsonify(success=True, user=user)
    else:
        return jsonify(success=False, message="User not found")

@app.route('/delete-account', methods=['POST'])
def delete_account():
    data = request.get_json()
    email = data.get('email')

    cursor.execute("DELETE FROM users WHERE email = %s", (email,))
    db.commit()
    return jsonify(success=True, message="Account deleted successfully")

@app.route('/change-password', methods=['POST'])
def change_password():
    data = request.get_json()
    email = data.get('email')
    current_password = data.get('currentPassword')
    new_password = data.get('newPassword')

    if not is_valid_password(new_password):
        return jsonify(success=False, message="Weak new password")

    cursor.execute("SELECT * FROM users WHERE email = %s AND password = %s", (email, current_password))
    user = cursor.fetchone()
    if not user:
        return jsonify(success=False, message="Current password is incorrect")

    cursor.execute("UPDATE users SET password = %s WHERE email = %s", (new_password, email))
    db.commit()
    return jsonify(success=True, message="Password updated successfully")

@app.route('/submit-feedback', methods=['POST'])
def submit_feedback():
    data = request.get_json()
    prediction_id = data.get('predictionId')
    feedback = data.get('feedback')

    if not prediction_id or not feedback:
        return jsonify(success=False, message="Prediction ID and feedback are required.")

    try:
        cursor.execute(
            "UPDATE predictions SET feedback = %s WHERE id = %s",
            (feedback, prediction_id)
        )
        db.commit()
        return jsonify(success=True, message="Feedback submitted successfully.")
    except Exception as e:
        return jsonify(success=False, message=f"Error: {str(e)}")

@app.route('/predictions', methods=['GET'])
def get_predictions():
    cursor.execute("SELECT * FROM predictions ORDER BY created_at DESC")
    predictions = cursor.fetchall()
    return jsonify(success=True, predictions=predictions)


@app.route('/history', methods=['POST'])
def view_history():
    data = request.get_json()
    user_id = data.get('userId')

    if not user_id:
        return jsonify({'success': False, 'message': 'User ID is required.'}), 400

    try:
        conn = pymysql.connect(host='localhost', user='root', password='', db='vegan_classification')
        cursor = conn.cursor(pymysql.cursors.DictCursor)

        cursor.execute("SELECT id, image_path, result_image_path, labels, result, feedback, created_at FROM predictions WHERE user_id = %s ORDER BY created_at DESC", (user_id,))
        history = cursor.fetchall()
        conn.close()

        return jsonify({'success': True, 'history': history})

    except Exception as e:
        return jsonify({'success': False, 'message': str(e)})


# Pass DB connection and cursor to the blueprint
app.config['db'] = db
app.config['cursor'] = cursor
app.register_blueprint(predict_bp)  # Register it

app.register_blueprint(recommendation_bp)

app.register_blueprint(admin_bp)

if __name__ == '__main__':
    app.run(debug=True)