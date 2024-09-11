import React, { useState } from 'react';
import Sidebar from '../../components/Sidebar';
import './CreateAdmin.css'
import axios from 'axios';

const CreateAdmin = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [accountType, setAccountType] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (password !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        try {
            await axios.post('http://localhost:5000/api/admins', {
                username,
                password,
                accountType,
            });
            alert('Account created successfully'); // Show success alert
            setUsername('');
            setPassword('');
            setConfirmPassword('');
            setAccountType('');
            setError('');
        } catch (err) {
            alert('Failed to create account. Please try again.'); // Show error alert
            setError('Failed to create account. Please try again.');
        }
    };

    const handleReset = () => {
        setUsername('');
        setPassword('');
        setConfirmPassword('');
        setAccountType('');
        setError('');
    };

    return (
        <div className="container-fluid">
            <div className="row flex-nowrap">
                <Sidebar />

                <div className="col py-3 content-area">
                    <h1 className="text-center caption mb-4">Add New Admins</h1>
                    <div className="interest-card">
                    {error && <div className="alert alert-danger">{error}</div>}
                    <form className="space-y-4" onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label htmlFor="username" className="form-label font-weight-bold">User name</label>
                            <input
                                type="text"
                                id="username"
                                className="form-control"
                                placeholder="Enter user name"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="password" className="form-label font-weight-bold">Password</label>
                            <input
                                type="password"
                                id="password"
                                className="form-control"
                                placeholder="Enter password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="confirm-password" className="form-label font-weight-bold">Confirm Password</label>
                            <input
                                type="password"
                                id="confirm-password"
                                className="form-control"
                                placeholder="Confirm password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="account-type" className="form-label font-weight-bold">Account type</label>
                            <select
                                id="account-type"
                                className="form-control"
                                value={accountType}
                                onChange={(e) => setAccountType(e.target.value)}
                            >
                                <option value="" disabled>Select category</option>
                                <option value="admin">Admin</option>
                                <option value="superadmin">Super Admin</option>
                            </select>
                        </div>
                        <div className="d-flex justify-content-between mt-4">
                            <button type="submit" className="btnall btnSave btn-success">Save</button>
                            <button type="button" className="btnall btnReset btn-danger" onClick={handleReset}>Reset</button>
                            
                        </div>
                    </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CreateAdmin;
