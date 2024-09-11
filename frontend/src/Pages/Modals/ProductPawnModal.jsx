import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ProductPawnModal = ({ selectedProduct, handleClose }) => {
    const [monthlyInterest, setMonthlyInterest] = useState('');
    const [totalPrice, setTotalPrice] = useState('');
    const [customerPaid, setCustomerPaid] = useState('');
    const [dueAmount, setDueAmount] = useState('');
    const [totalInterest, setTotalInterest] = useState('');

    useEffect(() => {
        if (selectedProduct) {
            const calculatedTotalPrice = parseFloat(selectedProduct.estimateValue) + parseFloat(selectedProduct.monthlyInterest);
            setTotalPrice(calculatedTotalPrice);
            setTotalInterest(calculatedTotalPrice - parseFloat(selectedProduct.estimateValue));
            setMonthlyInterest(selectedProduct.monthlyInterest);
            setDueAmount(parseFloat(selectedProduct.dueAmount || 0)); // Initial due amount from the selected product
        }
    }, [selectedProduct]);

    const handleInterestChange = (e) => {
        const interestValue = parseFloat(e.target.value || 0);
        setMonthlyInterest(interestValue);
        const newTotalPrice = parseFloat(selectedProduct.estimateValue) + interestValue;
        setTotalPrice(newTotalPrice);
        setTotalInterest(newTotalPrice - parseFloat(selectedProduct.estimateValue));
    };

    const handleCustomerPaidChange = (e) => {
        const paidValue = parseFloat(e.target.value || 0);
        setCustomerPaid(paidValue); // Simply update customerPaid without affecting dueAmount
    };

    const handleDueAmountChange = (e) => {
        setDueAmount(parseFloat(e.target.value || 0)); // Update due amount manually based on user input
    };

    const handleSave = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:5000/api/pawn-payment', {
                id: selectedProduct.id,
                monthlyInterest,
                totalPrice,
                customerPaid: selectedProduct.customerPaid + customerPaid,
                totalInterest,
                dueAmount // Use the manually inputted due amount
            });
            if (response.status === 200) {
                alert('Data saved successfully!');
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

    const handlePaymentReceived = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:5000/api/pawn-payment', {
                id: selectedProduct.id,
                status: 'Pawned',
                monthlyInterest,
                totalPrice,
                customerPaid: selectedProduct.customerPaid + customerPaid,
                totalInterest,
                dueAmount
            });
            if (response.status === 200) {
                alert('Pawned successfully!');
                handleClose();
                window.location.reload();
            } else {
                alert('Unexpected response from server');
            }
        } catch (error) {
            console.error('Error submitting payment data', error);
            alert('Error submitting payment data');
        }
    };

    return (
        <div className="modal fade" id="pawnPayModal" tabIndex="-1" aria-labelledby="pawnPayModalLabel" aria-hidden="true">
            <div className="modal-dialog">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title" id="pawnPayModalLabel">Pawn Payment</h5>
                        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" onClick={handleClose}></button>
                    </div>
                    <form onSubmit={handleSave}>
                        <div className="modal-body">
                            {selectedProduct && (
                                <>
                                    <div className="mb-3">
                                        <label htmlFor="estimateValue" className="form-label">Estimate Value</label>
                                        <input type="text" className="form-control" id="estimateValue" value={selectedProduct.estimateValue} readOnly />
                                    </div>

                                    <div className="mb-3">
                                        <label htmlFor="monthlyInterest" className="form-label">Interest (%)</label>
                                        <input
                                            type="number"
                                            className="form-control"
                                            id="monthlyInterest"
                                            value={monthlyInterest}
                                            onChange={handleInterestChange}
                                        />
                                    </div>

                                    <div className="mb-3">
                                        <label htmlFor="totalPrice" className="form-label">Total Price</label>
                                        <input type="text" className="form-control" id="totalPrice" value={totalPrice} readOnly />
                                    </div>

                                    <hr />

                                    <div className="mb-3">
                                        <label htmlFor="customerPaid" className="form-label">Customer Paid</label>
                                        <input type="number" className="form-control" id="customerPaid" value={customerPaid} onChange={handleCustomerPaidChange} />
                                    </div>

                                    <div className="mb-3">
                                        <label htmlFor="dueAmount" className="form-label">Due Amount</label>
                                        <input type="number" className="form-control" id="dueAmount" value={dueAmount} onChange={handleDueAmountChange} />
                                    </div>
                                </>
                            )}
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" data-bs-dismiss="modal" onClick={handleClose}>Close</button>
                            <button type="submit" className="btn btn-primary">Save</button>
                            <button type="button" className="btn btn-success" onClick={handlePaymentReceived}>Payment Received</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default ProductPawnModal;
