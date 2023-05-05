import React, { useState } from 'react';
import './App.css';
import { uploadImage } from './uploadImage';

function App() {
  const [file, setFile] = useState(null);
  const [labels, setLabels] = useState([]);

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!file) return;
    const imageLabels = await uploadImage(file);
    setLabels(imageLabels);
  };

  return (
    <div className="App">
      <h1>Image Recognition App</h1>
      <form onSubmit={handleSubmit}>
        <input type="file" onChange={handleFileChange} />
        <button type="submit">Analyze Image</button>
      </form>
      {labels.length > 0 && (
        <div>
          <h2>Labels:</h2>
          <ul>
            {labels.map((label, index) => (
              <li key={index}>{label.Name}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default App;
