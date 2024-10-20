import React, { useState } from 'react';
import axios from 'axios';
import config from "../../config";

const ProductSellModal = ({ selectedProduct, setSelectedProduct, handleSaveChanges, handleClose }) => {
    const [formData, setFormData] = useState({
        status: 'Sold',
        buyerName: '',
        buyerNic: '',
        buyerAddress: '',
        buyerPhone: '',
        sellDate: '',
        sellPrice: '',

    });

    const handleInputChange = (field, value) => {
        setSelectedProduct({ ...selectedProduct, [field]: value });
    };

    const handleChange = (e) => {
        const { id, value } = e.target;
        setFormData({
            ...formData,
            [id]: value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.put(`${config.BASE_URL}/api/buyer/${selectedProduct.id}`, formData); // Pass the product ID
            if (response.status === 201) {
                alert('Data submitted successfully!');
                handleClose();
                window.location.reload();
            } else {
                alert('Unexpected response from server');
            }
        } catch (error) {
            console.error('Error submitting data', error);
            alert('Error submitting data');
        }
    };


    return (
        <div className="modal fade" id="sellModal" tabIndex="-1" aria-labelledby="sellModalLabel" aria-hidden="true">
            <div className="modal-dialog">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title" id="sellModalLabel">Sell Product Details</h5>
                        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>

                    <div className="modal-body">
                        {selectedProduct && (
                            <form onSubmit={handleSubmit}>

                                <div className="mb-2">
                                    <label className="form-label">Receipt No</label>
                                    <input
                                        type="text"
                                        className="form-control form-control-sm"
                                        value={selectedProduct.recepitNo}
                                        readonly
                                    />
                                </div>

                                {/* <div className="mb-2">
                                    <label className="form-label">Customer Name</label>
                                    <input
                                        type="text"
                                        className="form-control form-control-sm"
                                        value={selectedProduct.customerName}
                                        onChange={(e) => handleInputChange('customerName', e.target.value)}
                                    />
                                </div> */}

                                {/* <div className="mb-2">
                                    <label className="form-label">NIC</label>
                                    <input
                                        type="text"
                                        className="form-control form-control-sm"
                                        value={selectedProduct.nic}
                                        onChange={(e) => handleInputChange('nic', e.target.value)}
                                    />
                                </div> */}

                                {/* <div className="mb-2">
                                    <label className="form-label">Address</label>
                                    <input
                                        type="text"
                                        className="form-control form-control-sm"
                                        value={selectedProduct.address}
                                        onChange={(e) => handleInputChange('address', e.target.value)}
                                    />
                                </div> */}

                                {/* <div className="mb-2">
                                    <label className="form-label">Phone</label>
                                    <input
                                        type="text"
                                        className="form-control form-control-sm"
                                        value={selectedProduct.phone}
                                        onChange={(e) => handleInputChange('phone', e.target.value)}
                                    />
                                </div> */}

                                <div className="mb-2">
                                    <label className="form-label">Item Category</label>
                                    <input
                                        type="text"
                                        className="form-control form-control-sm"
                                        value={selectedProduct.itemCategory}
                                        readonly
                                    />
                                </div>

                                <div className="mb-2">
                                    <label className="form-label">Item Name</label>
                                    <input
                                        type="text"
                                        className="form-control form-control-sm"
                                        value={selectedProduct.itemName}
                                        readonly
                                    />
                                </div>

                                <div className="mb-2">
                                    <label className="form-label">Item Model</label>
                                    <input
                                        type="text"
                                        className="form-control form-control-sm"
                                        value={selectedProduct.itemModel}
                                        readonly
                                    />
                                </div>



                                <div className="mb-2">
                                    <label className="form-label">Serial No/ IMEI</label>
                                    <input
                                        type="text"
                                        className="form-control form-control-sm"
                                        value={selectedProduct.itemNo}
                                        readonly
                                    />
                                </div>

                                {/* <div className="mb-2">
                                    <label className="form-label">Start Date</label>
                                    <input
                                        type="date"
                                        className="form-control form-control-sm"
                                        value={selectedProduct.startDate.slice(0, 10)}
                                        onChange={(e) => handleInputChange('startDate', e.target.value)}
                                    />
                                </div> */}

                                {/* <div className="mb-2">
                                    <label className="form-label">End Date</label>
                                    <input
                                        type="date"
                                        className="form-control form-control-sm"
                                        value={selectedProduct.endDate ? selectedProduct.endDate.slice(0, 10) : ''}
                                        onChange={(e) => handleInputChange('endDate', e.target.value)}
                                    />
                                </div> */}

                                <div className="mb-2">
                                    <label className="form-label">Pawning Advance</label>
                                    <input
                                        type="number"
                                        className="form-control form-control-sm"
                                        value={selectedProduct.marketValue}
                                        readonly
                                    />
                                </div>

                                <div className="mb-2">
                                    <label className="form-label">Pawning Advance</label>
                                    <input
                                        type="number"
                                        className="form-control form-control-sm"
                                        value={selectedProduct.estimateValue}
                                        readonly
                                    />
                                </div>

                                {/* <div className="mb-2">
                                    <label className="form-label">Interest (%)</label>
                                    <input
                                        type="number"
                                        className="form-control form-control-sm"
                                        value={selectedProduct.interest}
                                        onChange={(e) => handleInputChange('interest', e.target.value)}
                                    />
                                </div> */}

                                {/* <div className="mb-2">
                                    <label className="form-label">Duration (Months)</label>
                                    <input
                                        type="number"
                                        className="form-control form-control-sm"
                                        value={selectedProduct.duration || ''}
                                        onChange={(e) => handleInputChange('duration', e.target.value)}
                                    />
                                </div> */}

                                {/* <div className="mb-2">
                                    <label className="form-label">Total Price</label>
                                    <input
                                        type="number"
                                        className="form-control form-control-sm"
                                        value={selectedProduct.totalPrice}
                                        readOnly
                                    />
                                </div> */}
                                <hr />


                                <div className="mb-2">
                                    <label htmlFor="buyerName" className="form-label" style={{ fontSize: '0.9rem' }}>Buyer Name</label>
                                    <input
                                        type="text"
                                        className="form-control form-control-sm"
                                        id="buyerName"
                                        value={formData.buyerName}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>

                                <div className="mb-2">
                                    <label htmlFor="buyerNic" className="form-label" style={{ fontSize: '0.9rem' }}>Buyer Nic</label>
                                    <input
                                        type="text"
                                        className="form-control form-control-sm"
                                        id="buyerNic"
                                        value={formData.buyerNic}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>

                                <div className="mb-2">
                                    <label htmlFor="buyerAddress" className="form-label" style={{ fontSize: '0.9rem' }}>Buyer Addres</label>
                                    <input
                                        type="text"
                                        className="form-control form-control-sm"
                                        id="buyerAddress"
                                        value={formData.buyerAddress}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>


                                <div className="mb-2">
                                    <label htmlFor="buyerPhone" className="form-label" style={{ fontSize: '0.9rem' }}>Buyer Phone</label>
                                    <input
                                        type="text"
                                        className="form-control form-control-sm"
                                        id="buyerPhone"
                                        value={formData.buyerPhone}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>

                                <div className="mb-2">
                                    <label className="form-label">Selling Date</label>
                                    <input
                                        type="date"
                                        className="form-control form-control-sm"
                                        id="sellDate"
                                        value={formData.sellDate}
                                        onChange={handleChange}
                                    />
                                </div>

                                <div className="mb-2">
                                    <label className="form-label">Selling Price</label>
                                    <input
                                        type="number"
                                        className="form-control form-control-sm"
                                        id="sellPrice"
                                        value={formData.sellPrice}
                                        onChange={handleChange}
                                    />
                                </div>

                                <div className="modal-footer">
                                    <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                                    <button type="submit" className="btn btn-primary" >Save Changes</button>
                                </div>

                            </form>
                        )}
                    </div>

                </div>
            </div>
        </div>
    );
};

export default ProductSellModal;
