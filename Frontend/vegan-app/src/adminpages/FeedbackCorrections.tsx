import React, { useEffect, useState } from 'react';
import axios from 'axios';

const FeedbackCorrections = () => {
  const [feedbacks, setFeedbacks] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:5000/admin/feedbacks').then(res => setFeedbacks(res.data));
  }, []);

  const updateResult = (id: number, newResult: string) => {
    axios.post(`http://localhost:5000/admin/feedbacks/update/${id}`, { result: newResult })
      .then(() => alert("Updated"));
  };

  return (
    <div className="container mt-4">
      <h2>Feedback & Corrections</h2>
      <ul>
        {feedbacks.map((item: any) => (
          <li key={item.id}>
            {item.feedback} | Current: {item.result}
            <input type="text" placeholder="New Result" onBlur={(e) => updateResult(item.id, e.target.value)} />
          </li>
        ))}
      </ul>
    </div>
  );
};

export default FeedbackCorrections;
