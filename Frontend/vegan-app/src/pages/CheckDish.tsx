import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const CheckDish: React.FC = () => {
  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [resultImage, setResultImage] = useState<string | null>(null);
  const [labels, setLabels] = useState<string[]>([]);
  const [classification, setClassification] = useState('');
  const [predictionId, setPredictionId] = useState<number | null>(null);
  const [feedback, setFeedback] = useState('');
  const [feedbackSubmitted, setFeedbackSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const storedUser = localStorage.getItem('user');
  const userId = storedUser ? JSON.parse(storedUser).id : null;
  const navigate = useNavigate();

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedImage = e.target.files[0];
      setImage(selectedImage);
      setPreview(URL.createObjectURL(selectedImage));
      setResultImage(null);
      setLabels([]);
      setClassification('');
      setPredictionId(null);
      setFeedback('');
      setFeedbackSubmitted(false);
      setError('');
    }
  };

  const handlePredict = async () => {
    if (!image) {
      setError('Please upload an image.');
      return;
    }

    if (!userId) {
      setError('User not logged in.');
      return;
    }

    setLoading(true);
    setError('');

    const formData = new FormData();
    formData.append('image', image);
    formData.append('userId', userId);

    try {
      const res = await axios.post('http://localhost:5000/predict', formData);
      if (res.data.success) {
        setLabels(res.data.labels);
        setClassification(res.data.classification);
        setResultImage(`http://localhost:5000/image/${res.data.imagePath}`);
        setPredictionId(res.data.predictionId);
      } else {
        setError(res.data.message || 'Prediction failed.');
      }
    } catch {
      setError('Prediction request failed.');
    }

    setLoading(false);
  };

  const handleFeedbackSubmit = async () => {
    if (!predictionId || !feedback) {
      setError('Feedback is required.');
      return;
    }

    try {
      const res = await axios.post('http://localhost:5000/submit-feedback', {
        predictionId,
        feedback,
      });

      if (res.data.success) {
        setFeedbackSubmitted(true);
      } else {
        setError(res.data.message || 'Failed to submit feedback.');
      }
    } catch {
      setError('Feedback submission failed.');
    }
  };

  const handleGoBack = () => {
    navigate('/dashboard');
  };

  return (
    <div>
      {/* Sticky Navigation Bar */}
      <nav className="navbar navbar-light bg-white shadow-sm fixed-top">
        <div className="container-fluid">
          <button
            className="btn d-flex align-items-center p-0 border-0 bg-transparent"
            onClick={handleGoBack}
            style={{ textDecoration: 'none' }}
          >
            <i className="bi bi-arrow-left-circle text-success" style={{ fontSize: '1.8rem' }}></i>
            <span
              className="ms-2"
              style={{
                fontSize: '1.5rem',
                fontWeight: 'bold',
                color: '#28a745',
              }}
            >
              Veganify
            </span>
          </button>
        </div>
      </nav>

      {/* Main Content */}
      <div className="container mt-5 pt-5" style={{ maxWidth: '600px' }}>
        <h2 className="text-center text-success mb-4" style={{ fontWeight: 'bold' }}>Check Dish (Vegan or Not)</h2>

        <input type="file" className="form-control mb-3" accept="image/*" onChange={handleImageChange} />

        {preview && (
          <div className="text-center mb-4">
            <p className="text-muted mb-2">Selected Image:</p>
            <img
              src={preview}
              alt="preview"
              style={{ maxWidth: '300px', maxHeight: '300px', borderRadius: '10px', border: '1px solid #ccc' }}
            />
          </div>
        )}

        <div className="text-center mb-3">
          <button className="btn btn-success px-4" onClick={handlePredict} disabled={loading}>
            {loading ? 'Predicting...' : 'Predict'}
          </button>
        </div>

        {error && <div className="alert alert-danger">{error}</div>}

        {resultImage && (
          <div className="card mt-4 shadow-sm p-3">
            <h5 className="mb-2">Detected Labels:</h5>
            <ul>
              {labels.map((label, index) => (
                <li key={index}>{label}</li>
              ))}
            </ul>

            <h5
              className={classification === 'Vegan' ? 'text-success' : 'text-danger'}
              style={{ fontWeight: 'bold' }}
            >
              Final Classification: {classification}
            </h5>

            <div className="text-center mt-3">
              <p className="text-muted mb-2">Result Image:</p>
              <img
                src={resultImage}
                alt="result"
                style={{ maxWidth: '300px', maxHeight: '300px', borderRadius: '10px', border: '1px solid #ccc' }}
              />
            </div>

            {!feedbackSubmitted ? (
              <div className="mt-4">
                <label htmlFor="feedback" className="form-label">Was the prediction correct?</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Your feedback"
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                />
                <button className="btn btn-info mt-2 px-4" onClick={handleFeedbackSubmit}>
                  Submit Feedback
                </button>
              </div>
            ) : (
              <div className="alert alert-success mt-3">Thanks for your feedback!</div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default CheckDish;
