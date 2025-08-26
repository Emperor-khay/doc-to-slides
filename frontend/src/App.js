import React, { useState } from 'react';
import axios from 'axios';

function App() {
  const [file, setFile] = useState(null);
  const [response, setResponse] = useState('');

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await axios.post('http://localhost:3000/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
       window.alert("Server response:", res.data); // ✅ see full object in browser console
      setResponse(res.data.slides);
    } catch (err) {
      console.error(err);
      setResponse('Upload failed.');
    }
  };  

  return (
    <div style={{ padding: 20 }}>
      <h1>Upload Document</h1>
      <input type="file" onChange={handleFileChange} />
      <button onClick={handleUpload} style={{ marginLeft: 10 }}>Generate Slides</button>
      <pre>{response}</pre>
    </div>
  );
}

export default App;
