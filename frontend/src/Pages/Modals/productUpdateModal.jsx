import React from 'react';

import moment from 'moment-timezone';

const ProductUpdateModal = ({ selectedProduct, setSelectedProduct, handleSaveChanges }) => {

    const handleInputChange = (field, value) => {
        setSelectedProduct({ ...selectedProduct, [field]: value });
    };

    return (
        <div className="modal fade" id="updateModal" tabIndex="-1" aria-labelledby="updateModalLabel" aria-hidden="true">
            <div className="modal-dialog">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title" id="updateModalLabel">Update Product Details</h5>
                        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>

                    <div className="modal-body">
                        {selectedProduct && (
                            <form>

                                <div className="mb-2">
                                    <label className="form-label">Receipt No</label>
                                    <input
                                        type="text"
                                        className="form-control form-control-sm"
                                        value={selectedProduct.recepitNo}
                                        onChange={(e) => handleInputChange('recepitNo', e.target.value)}
                                    />
                                </div>

                                <div className="mb-2">
                                    <label className="form-label">Customer Name</label>
                                    <input
                                        type="text"
                                        className="form-control form-control-sm"
                                        value={selectedProduct.customerName}
                                        onChange={(e) => handleInputChange('customerName', e.target.value)}
                                    />
                                </div>

                                <div className="mb-2">
                                    <label className="form-label">NIC</label>
                                    <input
                                        type="text"
                                        className="form-control form-control-sm"
                                        value={selectedProduct.nic}
                                        onChange={(e) => handleInputChange('nic', e.target.value)}
                                    />
                                </div>

                                <div className="mb-2">
                                    <label className="form-label">Address</label>
                                    <input
                                        type="text"
                                        className="form-control form-control-sm"
                                        value={selectedProduct.address}
                                        onChange={(e) => handleInputChange('address', e.target.value)}
                                    />
                                </div>

                                <div className="mb-2">
                                    <label className="form-label">Phone</label>
                                    <input
                                        type="text"
                                        className="form-control form-control-sm"
                                        value={selectedProduct.phone}
                                        onChange={(e) => handleInputChange('phone', e.target.value)}
                                    />
                                </div>

                                <div className="mb-2">
                                    <label className="form-label">Item Category</label>
                                    <input
                                        type="text"
                                        className="form-control form-control-sm"
                                        value={selectedProduct.itemCategory}
                                        onChange={(e) => handleInputChange('itemCategory', e.target.value)}
                                    />
                                </div>

                                <div className="mb-2">
                                    <label className="form-label">Item Name</label>
                                    <input
                                        type="text"
                                        className="form-control form-control-sm"
                                        value={selectedProduct.itemName}
                                        onChange={(e) => handleInputChange('itemName', e.target.value)}
                                    />
                                </div>

                                <div className="mb-2">
                                    <label className="form-label">Item Model</label>
                                    <input
                                        type="text"
                                        className="form-control form-control-sm"
                                        value={selectedProduct.itemModel}
                                        onChange={(e) => handleInputChange('itemModel', e.target.value)}
                                    />
                                </div>

                                <div className="mb-2">
                                    <label className="form-label">Serial No/ IMEI</label>
                                    <input
                                        type="text"
                                        className="form-control form-control-sm"
                                        value={selectedProduct.itemNo}
                                        onChange={(e) => handleInputChange('itemNo', e.target.value)}
                                    />
                                </div>

                                <div className="mb-2">
                                    <label className="form-label">Start Date</label>
                                    <input
                                        type="datetime-local"
                                        className="form-control form-control-sm"
                                        value={selectedProduct.startDate ? selectedProduct.startDate.slice(0, 16) : ''}
                                        onChange={(e) => handleInputChange('startDate', e.target.value)}
                                    />
                                </div>

                                <div className="mb-2">
                                    <label className="form-label">End Date</label>
                                    <input
                                        type="datetime-local"
                                        className="form-control form-control-sm"
                                        value={selectedProduct.endDate ? moment(selectedProduct.endDate).format('YYYY-MM-DDTHH:mm') : ''}
                                        onChange={(e) => handleInputChange('endDate', e.target.value)}
                                    />
                                </div>

                                <div className="mb-2">
                                    <label className="form-label">Estimate Price</label>
                                    <input
                                        type="number"
                                        className="form-control form-control-sm"
                                        value={selectedProduct.marketValue}
                                        onChange={(e) => handleInputChange('marketValue', e.target.value)}
                                    />
                                </div>

                                <div className="mb-2">
                                    <label className="form-label">Pawning Advance</label>
                                    <input
                                        type="number"
                                        className="form-control form-control-sm"
                                        value={selectedProduct.estimateValue}
                                        onChange={(e) => handleInputChange('estimateValue', e.target.value)}
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
                            </form>
                        )}
                    </div>
                    <div className="modal-footer">
                        <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                        <button type="button" className="btn btn-primary" onClick={handleSaveChanges}>Save Changes</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductUpdateModal;
