import React, { useEffect, useState } from 'react';
import axios from 'axios';
import config from '../../config';

const ViewImage = ({ selectedProduct }) => {
  const [imageUrl, setImageUrl] = useState(null);

  useEffect(() => {
    if (selectedProduct && selectedProduct.id) {
      console.log('Fetching image for product ID:', selectedProduct.id);
      axios.get(`${config.BASE_URL}/api/products_images/${selectedProduct.id}/image`, {
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
      console.warn('No product selected or missing ID');
    }
  }, [selectedProduct]);

  return (
    <div className="modal fade" id="imageModal" tabIndex="-1" aria-labelledby="imageModalLabel" aria-hidden="true">
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title" id="imageModalLabel">Product Image</h5>
            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div className="modal-body">
            {imageUrl ? (
              <img src={imageUrl} style={{ maxWidth: '100%', maxHeight: '500px' }} alt="Product" className="img-fluid" />
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
