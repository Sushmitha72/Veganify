from flask import Blueprint, jsonify, request
import mysql.connector
from datetime import datetime

admin_bp = Blueprint('admin_bp', __name__)

# DB Connection
def get_db_connection():
    return mysql.connector.connect(
        host="localhost",
        user="root",
        password="",
        database="vegan_classification"
    )

# 1. Admin Dashboard (MODIFIED)
@admin_bp.route('/admin/dashboard', methods=['GET'])
def admin_dashboard():
    db = get_db_connection()
    cursor = db.cursor(dictionary=True)

    # Total users
    cursor.execute("SELECT COUNT(*) as total_users FROM users")
    total_users = cursor.fetchone()["total_users"]

    # Total classifications
    cursor.execute("SELECT COUNT(*) as total_predictions FROM predictions")
    total_predictions = cursor.fetchone()["total_predictions"]

    # Recent activity with JOIN to get userName
    cursor.execute("""
        SELECT p.id, p.result, p.created_at, u.userName AS user_name 
        FROM predictions p 
        LEFT JOIN users u ON p.user_id = u.id 
        ORDER BY p.created_at DESC 
        LIMIT 5
    """)
    recent = cursor.fetchall()

    db.close()
    return jsonify({
        "total_users": total_users,
        "total_predictions": total_predictions,
        "recent_activity": recent
    })


# 2. User Management
@admin_bp.route('/admin/users', methods=['GET'])
def get_users():
    db = get_db_connection()
    cursor = db.cursor(dictionary=True)
    cursor.execute("SELECT * FROM users")
    users = cursor.fetchall()
    db.close()
    return jsonify(users)

@admin_bp.route('/admin/user/delete/<int:user_id>', methods=['DELETE'])
def delete_user(user_id):
    db = get_db_connection()
    cursor = db.cursor()
    cursor.execute("DELETE FROM users WHERE id = %s", (user_id,))
    db.commit()
    db.close()
    return jsonify({"message": "User deleted"})

# 3. Classification History
@admin_bp.route('/admin/classifications', methods=['GET'])
def get_classification_history():
    db = get_db_connection()
    cursor = db.cursor(dictionary=True)

    query = """
        SELECT 
            predictions.id,
            predictions.image_path,
            predictions.labels,
            predictions.result,
            predictions.created_at,
            predictions.feedback,
            predictions.result_image_path,
            users.id AS user_id,
            users.userName
        FROM predictions
        LEFT JOIN users ON predictions.user_id = users.id
        ORDER BY predictions.created_at DESC
    """

    cursor.execute(query)
    rows = cursor.fetchall()
    db.close()
    return jsonify(rows)


