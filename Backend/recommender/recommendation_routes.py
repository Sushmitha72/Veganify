from flask import Blueprint, request, jsonify
from recommender.recommender import RecipeRecommender
import numpy as np

recommendation_bp = Blueprint('recommendation', __name__)
recommender = RecipeRecommender()  # Load once when app starts

@recommendation_bp.route('/recipe', methods=['POST'])
def recommend_recipe():
    try:
        data = request.get_json(force=True)
        print("🔍 Received data:", data)

        ingredients = data.get('ingredients', '')
        num = data.get('n', 3)

        if not ingredients:
            return jsonify({'error': 'No ingredients provided'}), 400

        recommendations = recommender.get_recommendations(ingredients, n_recommendations=num)

        # 🔁 Convert to native Python types
        for r in recommendations:
            for key, value in r.items():
                if isinstance(value, (np.integer, np.int64, np.int32)):
                    r[key] = int(value)
                elif isinstance(value, (np.floating, np.float64, np.float32)):
                    r[key] = float(value)
        # print("✅ Recommendations:", recommendations)

        return jsonify(recommendations), 200

    except Exception as e:
        import traceback
        traceback.print_exc()
        return jsonify({'error': str(e)}), 500
