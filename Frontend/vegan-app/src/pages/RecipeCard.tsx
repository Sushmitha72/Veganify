import React, { useState } from 'react';

export interface RecipeCardProps {
  title: string;
  ingredients: string;
  instructions: string;
  cuisine: string;
  cooking_time: number;
  similarity_score: number;
}

const RecipeCard: React.FC<RecipeCardProps> = ({
  title,
  ingredients,
  instructions,
  cuisine,
  cooking_time,
  similarity_score,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border rounded mb-3 shadow-sm bg-white">
      {/* Header Row */}
      <div
        className="d-flex justify-content-between align-items-center p-3"
        style={{ cursor: 'pointer' }}
        onClick={() => setIsOpen(!isOpen)}
      >
        {/* Title - Flexible Width */}
        <div className="flex-grow-1 text-truncate pe-2 fw-semibold">
          {title}
        </div>

        {/* Cuisine & Time - Fixed Width */}
        <div style={{ minWidth: '150px' }} className="text-muted text-end pe-3">
          {cuisine} • {cooking_time} mins
        </div>

        {/* Icon */}
        <i className={`bi ${isOpen ? 'bi-chevron-up' : 'bi-chevron-down'} fs-5`}></i>
      </div>

      {/* Collapsible Body */}
      {isOpen && (
        <div className="px-3 pb-3">
          <p><strong>Ingredients:</strong><br />{ingredients}</p>
          <p><strong>Instructions:</strong><br />{instructions}</p>
          <p>
            <strong>Match Score:</strong>{' '}
            <span className="badge bg-success">{similarity_score.toFixed(2)}</span>
          </p>
        </div>
      )}
    </div>
  );
};

export default RecipeCard;
