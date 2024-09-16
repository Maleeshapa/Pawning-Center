import React, { useEffect, useState } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css'; // Ensure Bootstrap CSS is included
import 'bootstrap/dist/js/bootstrap.bundle.min'; // Ensure Bootstrap JS is included

const ViewImage = ({ customer }) => {
  const [imageUrl, setImageUrl] = useState(null);

  useEffect(() => {
    if (customer && customer.id) {
      console.log('Fetching image for customer ID:', customer.id);
      axios.get(`http://localhost:5000/api/customer_images/${customer.id}/image`, {
        responseType: 'blob',
      })
      .then(response => {
        console.log('Image fetched successfully');
        const imageUrl = URL.createObjectURL(response.data);
        setImageUrl(imageUrl);
      })
      .catch(err => {
        console.error('Error fetching image:', err);
      });
    } else {
      console.warn('No customer selected or missing ID');
    }

    // Initialize the modal
    const modalElement = document.getElementById('imageModal');
    if (modalElement) {
      const modal = new bootstrap.Modal(modalElement);
      modal.show();
    }

  }, [customer]);

  return (
    <div className="modal fade" id="imageIdModal" tabIndex="-1" aria-labelledby="imageIdModalLabel" aria-hidden="true">
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title" id="imageModalLabel">Product Image</h5>
            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div className="modal-body">
            {imageUrl ? (
              <img src={imageUrl} style={{ maxWidth: '100%', maxHeight: '400px' }} alt="Product" className="img-fluid" />
            ) : (
              <p>No image available for this product</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewImage;
