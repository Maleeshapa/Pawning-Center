import React, { useState, useEffect } from 'react';
import axios from 'axios';
import config from '../../config';

const ProductPawnModal = ({ selectedProduct, handleClose }) => {
    const [estimateValue, setEstimateValue] = useState('');
    const [totalDue, setTotalDue] = useState('');
    const [monthlyInterest, setMonthlyInterest] = useState('');
    const [totalOutstanding, setTotalOutstanding] = useState('');
    const [paid, setPaid] = useState('');
    const [discount, setDiscount] = useState('');
    const [dueAmount, setDueAmount] = useState('');
    const [totalInterest, setTotalInterest] = useState('');

    useEffect(() => {
        if (selectedProduct) {
            setEstimateValue(parseFloat(selectedProduct.estimateValue) || 0);
            setTotalDue(parseFloat(selectedProduct.totalDue) || parseFloat(selectedProduct.estimateValue) || 0);
            setTotalInterest(parseFloat(selectedProduct.totalInterest) || 0);
            setDueAmount(parseFloat(selectedProduct.dueAmount) || parseFloat(selectedProduct.estimateValue) || 0);
        }
    }, [selectedProduct]);

    useEffect(() => {
        const calculatedTotalOutstanding = totalDue + parseFloat(monthlyInterest || 0);
        setTotalOutstanding(calculatedTotalOutstanding);
        updateDueAmount(calculatedTotalOutstanding, parseFloat(paid || 0), parseFloat(discount || 0));
    }, [totalDue, monthlyInterest, paid, discount]);

    const updateDueAmount = (outstanding, paidAmount, discountAmount) => {
        const calculated = outstanding - paidAmount - discountAmount;
        setDueAmount(Math.max(calculated, 0)); // Ensure due amount is not negative
    };

    const handleInterestChange = (e) => {
        const interestValue = parseFloat(e.target.value || 0);
        setMonthlyInterest(interestValue);
        setTotalInterest(prevTotalInterest => prevTotalInterest + interestValue);
    };

    const handlePaidChange = (e) => {
        const paidValue = parseFloat(e.target.value || 0);
        setPaid(paidValue);
    };

    const handleDiscountChange = (e) => {
        const discountValue = parseFloat(e.target.value || 0);
        setDiscount(discountValue);
    };

    const handleSave = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post(`${config.BASE_URL}/api/pawn-payment`, {
                id: selectedProduct.id,
                totalDue: dueAmount, // Update totalDue with new dueAmount
                monthlyInterest,
                totalInterest,
                totalOutstanding,
                customerPaid: parseFloat(selectedProduct.customerPaid || 0) + parseFloat(paid || 0),
                dueAmount,
                discount
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
                                        <label htmlFor="estimateValue" className="form-label">Pawning Advance - ඇස්තමෙන්තුගත අගය</label>
                                        <input type="text" className="form-control" id="estimateValue" value={estimateValue} readOnly />
                                    </div>

                                    <div className="mb-3">
                                        <label htmlFor="totalDue" className="form-label">Total Due - මුලු හිගය මුදල</label>
                                        <input type="text" className="form-control" id="totalDue" value={totalDue} readOnly />
                                    </div>

                                    <div className="mb-3">
                                        <label htmlFor="monthlyInterest" className="form-label">Interest - මාසික පොලී මුදල</label>
                                        <input
                                            type="number"
                                            className="form-control"
                                            id="monthlyInterest"
                                            value={monthlyInterest}
                                            onChange={handleInterestChange}
                                            step="1" onWheel={(e) => e.preventDefault()}
                                        />
                                    </div>

                                    <div className="mb-3">
                                        <label htmlFor="totalOutstanding" className="form-label">Total Outstanding - හිගය + මාසික පොලිය</label>
                                        <input type="text" className="form-control" id="totalOutstanding" value={totalOutstanding} readOnly />
                                    </div>

                                    <div className="mb-3">
                                        <label htmlFor="paid" className="form-label">Paid -  ගෙවු මුදල</label>
                                        <input type="number" className="form-control" id="paid" value={paid} onChange={handlePaidChange} step="1" onWheel={(e) => e.preventDefault()} />
                                    </div>

                                    <div className="mb-3">
                                        <label htmlFor="discount" className="form-label">Discount - වට්ටම</label>
                                        <input type="number" className="form-control" id="discount" value={discount} onChange={handleDiscountChange} step="1" onWheel={(e) => e.preventDefault()} />
                                    </div>

                                    <div className="mb-3">
                                        <label htmlFor="dueAmount" className="form-label">Due Amount - නව හිග මුදල</label>
                                        <input type="text" className="form-control" id="dueAmount" value={dueAmount} readOnly />
                                    </div>
                                </>
                            )}
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" data-bs-dismiss="modal" onClick={handleClose}>Close</button>
                            <button type="submit" className="btn btn-primary">Save Changes</button>
                           
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default ProductPawnModal;