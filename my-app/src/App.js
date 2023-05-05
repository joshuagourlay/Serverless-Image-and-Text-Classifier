import { useRef, useState } from 'react';
import './App.css';
import { uploadImage } from './uploadImage';
import { withAuthenticator } from '@aws-amplify/ui-react';

function App() {
  const fileInput = useRef(null);
  const [labels, setLabels] = useState([]);
  const [uploadedImageURL, setUploadedImageURL] = useState(null);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!fileInput.current.files[0]) return;
    const imageFile = fileInput.current.files[0];
    const imageLabels = await uploadImage(imageFile);
    console.log("Image labels: ", imageLabels);
    setLabels(imageLabels);
    const imageURL = URL.createObjectURL(imageFile);
    setUploadedImageURL(imageURL);
  };

  return (
    <div className="App">
      <h1>Image Recognition App</h1>
      <form onSubmit={handleSubmit}>
        <input type="file" ref={fileInput} />
        <button type="submit">Analyze Image</button>
      </form>
      {uploadedImageURL && (
        <div>
          <h2>Uploaded Image:</h2>
          <img src={uploadedImageURL} alt="Uploaded" style={{ maxWidth: '100%' }} />
        </div>
)}
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

export default withAuthenticator(App);
