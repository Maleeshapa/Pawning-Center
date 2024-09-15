import React, { useState } from 'react';
import axios from 'axios';

const Image = () => {
  const [image, setImage] = useState(null);

  const handleFileChange = (e) => {
    setImage(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('image', image);

    try {
      const res = await axios.post('http://localhost:5000/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      alert(res.data);
    } catch (err) {
      console.error(err);
      alert('Error uploading image');
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input type="file" accept="image/*" className="form-control form-control-sm" onChange={handleFileChange} />
        <button type="submit">Upload Image</button>
      </form>
    </div>
  );
};

export default Image;
