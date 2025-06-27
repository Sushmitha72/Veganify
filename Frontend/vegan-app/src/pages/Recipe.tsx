import React, { useState } from 'react';
import axios from 'axios';
import RecipeCard, { RecipeCardProps } from '../pages/RecipeCard';
import { useNavigate } from 'react-router-dom';

const Recipe: React.FC = () => {
  const [ingredients, setIngredients] = useState('');
  const [recipes, setRecipes] = useState<RecipeCardProps[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleGoBack = () => navigate(-1);

  const handleSubmit = async () => {
    if (!ingredients.trim()) {
      setError('Please enter some ingredients');
      return;
    }

    try {
      setLoading(true);
      setError('');

      const response = await axios.post('http://localhost:5000/recipe', {
        ingredients,
        n_recommendations: 3,
      });

      setRecipes(response.data || []);
    } catch (err) {
      setError('Failed to fetch recipes');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ backgroundColor: '#f8f9fa', minHeight: '100vh' }}>
      {/* Navbar */}
      <nav className="navbar navbar-light bg-white shadow-sm fixed-top">
        <div className="container-fluid">
          <button
            className="btn d-flex align-items-center p-0 border-0 bg-transparent"
            onClick={handleGoBack}
          >
            <i className="bi bi-arrow-left-circle text-success" style={{ fontSize: '1.8rem' }}></i>
            <span
              className="ms-2"
              style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#28a745' }}
            >
              Veganify
            </span>
          </button>
        </div>
      </nav>

      {/* Main content */}
      <div className="container mt-5 pt-5">
        <h2 className="text-center mb-4" style={{ color: '#343a40' }}>
          🍲 Discover Recipes with Your Ingredients!
        </h2>

        <div
          className="p-4 mb-4 shadow-sm rounded bg-white"
          style={{ borderLeft: '5px solid #28a745' }}
        >
          <textarea
            className="form-control mb-3"
            rows={4}
            placeholder="Enter ingredients (e.g. rice, tomato, garlic)"
            value={ingredients}
            onChange={(e) => setIngredients(e.target.value)}
            style={{ resize: 'none' }}
          />
          <div className="text-center">
            <button className="btn btn-success px-4" onClick={handleSubmit} disabled={loading}>
              {loading ? 'Finding recipes...' : 'Get Recommendations'}
            </button>
          </div>
        </div>

        {error && <div className="alert alert-danger text-center">{error}</div>}

        {recipes.length > 0 && (
          <div className="row">
            {recipes.map((recipe, index) => (
              <RecipeCard key={index} {...recipe} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Recipe;
