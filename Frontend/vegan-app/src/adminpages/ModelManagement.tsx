import React, { useState } from 'react';
import axios from 'axios';

const ModelManagement = () => {
  const [file, setFile] = useState<any>(null);

  const handleUpload = () => {
    const formData = new FormData();
    formData.append('model', file);
    axios.post('http://localhost:5000/admin/models', formData)
      .then(res => alert(res.data.message));
  };

  return (
    <div className="container mt-4">
      <h2>Model Management</h2>
      <input type="file" onChange={e => setFile(e.target.files?.[0])} />
      <button className="btn btn-primary" onClick={handleUpload}>Upload Model</button>
    </div>
  );
};

export default ModelManagement;
