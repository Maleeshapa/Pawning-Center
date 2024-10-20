import React from 'react';
import Sidebar from '../../components/Sidebar';
import './Interest.css'
import { useState } from 'react';

const Interest = () => {
    const [duration, setDuration] = useState('');
    const [monthlyInterestRate, setMonthlyInterestRate] = useState('15');
    const [amountReq, setAmount] = useState('');
    const [monthlyPayment, setMonthlyPayment] = useState(null);
    const [monthlyInterest, setMonthlyInterest] = useState(null);
    const [totalPayment, setTotalPayment] = useState(null);
    const [totalInterest, setTotalInterest] = useState(null);
    const [error, setError] = useState('')

    const calculater = () => {
        setError('');
        const durationMonths = parseFloat(duration);
        const rate = parseFloat(monthlyInterestRate);
        const amount = parseFloat(amountReq);

        if (isNaN(durationMonths) || durationMonths <= 0 || isNaN(rate) || rate <= 0 || isNaN(amountReq) || amountReq <= 0) {
            setError('Please Enter Valid Value');
            return
        }
        const monthlyInterest = (amount * rate) / 100;
        const monthlyPayment = monthlyInterest + (amount / durationMonths);
        const totalInterest = monthlyInterest * durationMonths;
        const total = amount + totalInterest;



        setMonthlyInterest(monthlyInterest);
        setMonthlyPayment(monthlyPayment);
        setTotalPayment(total);
        setTotalInterest(totalInterest);
    }

    const resetBtn = () => {
        setMonthlyInterestRate("15");
        setAmount("");
        setDuration("");
        setMonthlyPayment(null);
        setMonthlyInterest(null)
        setTotalInterest(null);
        setTotalPayment(null);
    }
    return (
        <div className="container-fluid">
            <div className="row flex-nowrap">
                <Sidebar />

                <div className="col py-3 content-area">
                    <h1 className="caption">Calculate Interest</h1>

                    <div className="interest-card">
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
                                <label className="">Interest %</label>
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
                                <label className="">Price Of Item</label>
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
                                <label className="">Duration (Months)</label>
                            </div>
                        </form>

                        <div className="calculater-right">
                            <div className="output">
                                <div className="output-text">
                                    <p>Monthly Interst: {monthlyInterest !== null && (<span> Rs.{monthlyInterest}</span>)}</p>
                                </div>
                                <div className="output-text">
                                    <p>Monthly payment: {monthlyInterest !== null && (<span> Rs.{monthlyPayment}</span>)}</p>
                                </div>
                                <div className="output-text">
                                    <p>Total Interest Paid:
                                        {monthlyInterest !== null && (<span> Rs. {totalInterest}</span>)}</p>
                                </div>
                                <div className="output-text">
                                    <p>Total Payment:
                                        {monthlyInterest !== null && (<span> Rs. {totalPayment}</span>)}</p>
                                </div>
                                <div className="error">
                                    <p>{error && <p>{error}</p>}</p>
                                </div>
                            </div>
                        </div>

                        <div className="">
                            <button type="button" className='btnSave btnall' onClick={calculater}>Calculate</button>{' '}
                            <button type="button" className='btnReset btnall' onClick={resetBtn}>Reset</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Interest;
