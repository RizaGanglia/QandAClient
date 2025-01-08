import React, { useState } from "react";
import axios from "axios";
import "./UploadDocument.css";

const UploadDocument = () => {
  const [file, setFile] = useState(null);
  const [uploadStatus, setUploadStatus] = useState("");

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
    setUploadStatus("");
  };

  const handleUpload = async () => {
    if (!file) {
      alert("Please upload a file.");
      return;
    }
  
    const formData = new FormData();
    formData.append('file', file);  // Correctly append the file
  
    try {
      const response = await axios.post('https://qandaserver.onrender.com/uploads', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
  
      console.log('File uploaded successfully:', response.data);
      setUploadStatus('File uploaded successfully!');
    } catch (error) {
      console.error('Failed to upload file:', error);
      setUploadStatus('Failed to upload file.');
    }
  };
  
  return (
    <div className="upload-container">
      <input type="file" onChange={handleFileChange} className="upload-input" />
      <button onClick={handleUpload} className="upload-button">
        Upload Document
      </button>
      {uploadStatus && <p className="upload-status">{uploadStatus}</p>}
    </div>
  );
};

export default UploadDocument;
