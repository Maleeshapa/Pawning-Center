import React, { useEffect, useState } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css'; // Ensure Bootstrap CSS is included
import 'bootstrap/dist/js/bootstrap.bundle.min'; // Ensure Bootstrap JS is included
import config from '../../config';

const ViewImage = ({ selectedCustomer }) => {
  const [imageUrl, setImageUrl] = useState(null);

  useEffect(() => {
    if (selectedCustomer && selectedCustomer.id) {
      console.log('Fetching image for customer ID:', selectedCustomer.id);
      axios.get(`${config.BASE_URL}/api/customer_images/${selectedCustomer.id}/image`, {
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
      const modal = new window.bootstrap.Modal(modalElement);
      modal.show();
    }

  }, [selectedCustomer]);

  return (
    <div className="modal fade" id="imageIdModal" tabIndex="-1" aria-labelledby="imageIdModalLabel" aria-hidden="true">
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title" id="imageModalLabel">customer Image</h5>
            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div className="modal-body">
            {imageUrl ? (
              <img src={imageUrl} style={{ maxWidth: '100%', maxHeight: '500px' }} alt="customer" className="img-fluid" />
            ) : (
              <p>No image available for this customer</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewImage;
