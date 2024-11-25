import React, { useState } from 'react';
import PropTypes from 'prop-types';

const PhotoUpload = ({ onUpload }) => {
  const [file, setFile] = useState(null);

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const handleUpload = async () => {
    if (file) {
      const formData = new FormData();
      formData.append('photo', file);

      try {
        // Adjust this URL to your backend endpoint for photo uploads
        const response = await fetch('/api/upload-photo', {
          method: 'POST',
          body: formData,
        });

        if (response.ok) {
          const data = await response.json();
          onUpload(data.photoUrl);  // Assume backend returns { photoUrl: '...' }
        } else {
          alert('Failed to upload photo');
        }
      } catch (error) {
        console.error('Error uploading photo:', error);
        alert('Error uploading photo');
      }
    }
  };

  return (
    <div>
      <input type="file" onChange={handleFileChange} />
      <button onClick={handleUpload}>Upload Photo</button>
    </div>
  );
};

PhotoUpload.propTypes = {
  onUpload: PropTypes.func.isRequired,
};

export default PhotoUpload;