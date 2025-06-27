Veganify: Vegan and Non-Vegan Dish Classification System

Veganify is a full-stack AI-powered web application that automatically classifies food dishes as vegan or non-vegan using image analysis and suggests similar recipes. It leverages YOLOv8, Flask, React, and MySQL, making it a smart companion for dietary decision-making.

Features

*  Classify food dishes using image uploads
*  YOLOv8 object detection for identifying non-vegan ingredients (meat, eggs, dairy)
*  Recipe recommendations using TF-IDF, cosine similarity, and KMeans clustering
*  View classification history
*  User and admin role-based dashboards
*  Feedback system for model improvement
*  Profile management (change password, delete account)

Frontend:

* React + TypeScript
* Bootstrap 
* Axios

Backend:

* Flask (Python)
* MySQL (via XAMPP)
* YOLOv8 (Ultralytics)
* Scikit-learn (TF-IDF, cosine similarity, KMeans)
* OpenCV, Pandas, NumPy

Prerequisites

* Python 3.9+
* Node.js & npm
* MySQL (with XAMPP or any server)
* Roboflow account (for dataset)
* YOLOv8 (installed via Ultralytics)


Start Backend

bash
cd backend
python app.py


Start Frontend

bash
cd frontend
npm start
