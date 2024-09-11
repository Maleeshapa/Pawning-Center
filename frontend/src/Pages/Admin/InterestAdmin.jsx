import React, { useState } from 'react';
import './InterestAdmin.css';
import SidebarAdmin from '../../components/SidebarAdmin';

const InterestAdmin = () => {
    const [duration, setDuration] = useState('');
    const [monthlyInterestRate, setMonthlyInterestRate] = useState('15');
    const [amountReq, setAmount] = useState('');
    const [monthlyPayment, setMonthlyPayment] = useState(null);
    const [monthlyInterest, setMonthlyInterest] = useState(null);
    const [totalPayment, setTotalPayment] = useState(null);
    const [totalInterest, setTotalInterest] = useState(null);
    const [error, setError] = useState('');

    const calculate = () => {
        setError('');
        const durationMonths = parseFloat(duration);
        const rate = parseFloat(monthlyInterestRate);
        const amount = parseFloat(amountReq);

        if (isNaN(durationMonths) || durationMonths <= 0 || isNaN(rate) || rate <= 0 || isNaN(amount) || amount <= 0) {
            setError('Please Enter Valid Value');
            return;
        }

        const monthlyInterest = (amount * rate) / 100;
        const monthlyPayment = monthlyInterest + (amount / durationMonths);
        const totalInterest = monthlyInterest * durationMonths;
        const total = amount + totalInterest;

        setMonthlyInterest(monthlyInterest);
        setMonthlyPayment(monthlyPayment);
        setTotalPayment(total);
        setTotalInterest(totalInterest);
    };

    const resetBtn = () => {
        setMonthlyInterestRate("15");
        setAmount("");
        setDuration("");
        setMonthlyPayment(null);
        setMonthlyInterest(null);
        setTotalInterest(null);
        setTotalPayment(null);
    };

    return (
        <div className="container-fluid">
            <div className="row flex-nowrap">
                <SidebarAdmin />

                <div className="col py-3">
                    <div className="container">
                        <div className="row justify-content-center">
                            <div className="col-lg-6 col-md-8 col-sm-10">
                                <h1 className="caption text-center">Calculate Interest</h1>

                                <div className="calculator">
                                    <form className="space-y-4">
                                        <div className="form-group">
                                            <input
                                                type="number"
                                                step="0.01"
                                                value={monthlyInterestRate}
                                                onChange={(e) => setMonthlyInterestRate(e.target.value)}
                                                className="form-control"
                                                placeholder='Enter Interest %'
                                            />
                                            <label>Interest %</label>
                                        </div>

                                        <div className="form-group">
                                            <input
                                                type="number"
                                                step="0.01"
                                                value={amountReq}
                                                onChange={(e) => setAmount(e.target.value)}
                                                className="form-control"
                                                placeholder='Enter item amount'
                                            />
                                            <label>Price Of Item</label>
                                        </div>

                                        <div className="form-group">
                                            <input
                                                type="number"
                                                value={duration}
                                                onChange={(e) => setDuration(e.target.value)}
                                                id="duration"
                                                className="form-control"
                                                placeholder='Enter duration (months)'
                                            />
                                            <label>Duration (Months)</label>
                                        </div>
                                    </form>

                                    <div className="output mt-4">
                                        <div className="output-text">
                                            <p>Monthly Interest: {monthlyInterest !== null && (<span> Rs.{monthlyInterest}</span>)}</p>
                                        </div>
                                        <div className="output-text">
                                            <p>Monthly Payment: {monthlyPayment !== null && (<span> Rs.{monthlyPayment}</span>)}</p>
                                        </div>
                                        <div className="output-text">
                                            <p>Total Interest Paid: {totalInterest !== null && (<span> Rs. {totalInterest}</span>)}</p>
                                        </div>
                                        <div className="output-text">
                                            <p>Total Payment: {totalPayment !== null && (<span> Rs. {totalPayment}</span>)}</p>
                                        </div>
                                        <div className="error">
                                            <p>{error && <p>{error}</p>}</p>
                                        </div>
                                    </div>

                                    <div className="text-center mt-4">
                                        <button type="button" className='btn btn-primary me-2' onClick={calculate}>Calculate</button>
                                        <button type="button" className='btn btn-secondary' onClick={resetBtn}>Reset</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default InterestAdmin;
