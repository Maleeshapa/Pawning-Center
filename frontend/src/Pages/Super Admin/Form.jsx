import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';
import './Form.css';

const Form = ({ onClose }) => {
    const [formData, setFormData] = useState({
        recepitNo: '',
        customerName: '',
        nic: '',
        address: '',
        phone: '',
        startDate: '',
        itemCategory: '',
        itemModel: '',
        itemName: '',
        itemNo: '',
        size: '',
        marketValue: '',
        estimateValue: '',
    });

    const [categories, setCategories] = useState([]); 
    const [models, setModels] = useState([]); 

    // Fetch categories from the database when the component mounts
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/categories');
                setCategories(response.data); // Set the fetched categories to state
            } catch (error) {
                console.error('Error fetching categories:', error);
            }
        };

        const fetchModels = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/models');
                setModels(response.data); // Set the fetched models to state
            } catch (error) {
                console.error('Error fetching models:', error);
            }
        };

        fetchCategories();
        fetchModels();
    }, []);

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
            const response = await axios.post('http://localhost:5000/api/submit', formData);
            if (response.status === 201) {
                alert('Data submitted successfully!');
                onClose();
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
        <div className="d-flex justify-content-center align-items-center position-fixed top-0 start-0 w-100 h-100 bg-dark bg-opacity-50">
            <div className="bg-light rounded p-4 shadow-lg w-100 overflow-auto" style={{ maxWidth: '450px', maxHeight: '95vh' }}>
                <h2 className="text-center mb-4" style={{ fontSize: '1.5rem' }}>Fill the Form</h2>
                <hr />
                <form onSubmit={handleSubmit}>
                    <div className="mb-2">
                        <label htmlFor="recepitNo" className="form-label" style={{ fontSize: '0.9rem' }}>Receipt Number</label>
                        <input
                            type="text"
                            className="form-control form-control-sm"
                            id="recepitNo"
                            value={formData.recepitNo}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="mb-2">
                        <label htmlFor="customerName" className="form-label" style={{ fontSize: '0.9rem' }}>Customer Name</label>
                        <input
                            type="text"
                            className="form-control form-control-sm"
                            id="customerName"
                            value={formData.customerName}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="mb-2">
                        <label htmlFor="nic" className="form-label" style={{ fontSize: '0.9rem' }}>NIC</label>
                        <input
                            type="text"
                            className="form-control form-control-sm"
                            id="nic"
                            value={formData.nic}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="mb-2">
                        <label htmlFor="address" className="form-label" style={{ fontSize: '0.9rem' }}>Address</label>
                        <input
                            type="text"
                            className="form-control form-control-sm"
                            id="address"
                            value={formData.address}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="mb-2">
                        <label htmlFor="phone" className="form-label" style={{ fontSize: '0.9rem' }}>Phone Number</label>
                        <input
                            type="tel"
                            className="form-control form-control-sm"
                            id="phone"
                            value={formData.phone}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="mb-2">
                        <label htmlFor="startDate" className="form-label" style={{ fontSize: '0.9rem' }}>Start Date</label>
                        <input
                            type="date"
                            className="form-control form-control-sm"
                            id="startDate"
                            value={formData.startDate}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="mb-2">
                        <label htmlFor="itemCategory" className="form-label" style={{ fontSize: '0.9rem' }}>Item Category</label>
                        <select
                            className="form-select form-select-sm"
                            id="itemCategory"
                            value={formData.itemCategory}
                            onChange={handleChange}
                            required
                        >
                            <option value="" disabled>Select item category</option>
                            {categories.map((category, index) => (
                                <option key={index} value={category.categoryName}>{category.categoryName}</option>
                            ))}
                        </select>
                    </div>

                    <div className="mb-2">
                        <label htmlFor="itemModel" className="form-label" style={{ fontSize: '0.9rem' }}>Item Model</label>
                        <select
                            className="form-select form-select-sm"
                            id="itemModel"
                            value={formData.itemModel}
                            onChange={handleChange}
                            
                        >
                            <option value="" disabled>Select Item Model</option>
                            {models.map((model, index) => (
                                <option key={index} value={model.modelName}>{model.modelName}</option>
                            ))}
                        </select>
                    </div>

                    <div className="mb-2">
                        <label htmlFor="itemName" className="form-label" style={{ fontSize: '0.9rem' }}>Item Name</label>
                        <input
                            type="text"
                            className="form-control form-control-sm"
                            id="itemName"
                            value={formData.itemName}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="mb-2">
                        <label htmlFor="itemNo" className="form-label" style={{ fontSize: '0.9rem' }}>Item Number</label>
                        <input
                            type="text"
                            className="form-control form-control-sm"
                            id="itemNo"
                            value={formData.itemNo}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="mb-2">
                        <label htmlFor="size" className="form-label" style={{ fontSize: '0.9rem' }}>Item Size</label>
                        <input
                            type="text"
                            className="form-control form-control-sm"
                            id="size"
                            value={formData.size}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="mb-2">
                        <label htmlFor="marketValue" className="form-label" style={{ fontSize: '0.9rem' }}>Market Price</label>
                        <input
                            type="number"
                            className="form-control form-control-sm"
                            id="marketValue"
                            value={formData.marketValue}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="mb-2">
                        <label htmlFor="estimateValue" className="form-label" style={{ fontSize: '0.9rem' }}>Estimated Price</label>
                        <input
                            type="number"
                            className="form-control form-control-sm"
                            id="estimateValue"
                            value={formData.estimateValue}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="text-end mt-4">
                        <button type="submit" className="btn btn-sm btn-primary">Submit</button>
                        <button type="button" className="btn btn-sm btn-secondary ms-2" onClick={onClose}>Cancel</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Form;
