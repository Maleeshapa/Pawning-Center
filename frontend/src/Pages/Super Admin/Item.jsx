import './Dashboard.css';
import Sidebar from '../../components/Sidebar';
import React, { useState } from 'react';
import axios from 'axios';
import config from '../../config';

const Item = () => {
    const [categoryName, setCategoryName] = useState('');
    const [modelName, setModelName] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();

        const formData = {
            categoryName,
            modelName,
        };

        try {
            // Post data to the backend
            const response = await axios.post(`${config.BASE_URL}/api/items-add`, formData);
            console.log('Data submitted:', response.data);
            // Reset form fields
            setCategoryName('');
            setModelName('');
        } catch (error) {
            console.error('Error submitting form:', error);
        }
    };

    return (
        <div className="container-fluid">
            <div className="row flex-nowrap">
                <Sidebar />
                <div className="col py-3 content-area">
                    <h3 className='caption'>Item</h3>
                    <main className="col-md-12 p-3 bg-white">
                        <div className="row text-center justify-content-center">
                            <div className="col-md-6">
                                <form onSubmit={handleSubmit}>
                                    <div className="form-group mb-3">
                                        <label>Category Name:</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            value={categoryName}
                                            onChange={(e) => setCategoryName(e.target.value)}
                                            placeholder="Enter category name"
                                            required
                                        />
                                    </div>
                                    <div className="form-group mb-3">
                                        <label>Model Name:</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            value={modelName}
                                            onChange={(e) => setModelName(e.target.value)}
                                            placeholder="Enter model name"
                                            required
                                        />
                                    </div>
                                    <div className="d-grid gap-2">
                                        <button type="submit" className="btn btn-primary">
                                            Add Item
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </main>
                </div>
            </div>
        </div>
    );
};

export default Item;
