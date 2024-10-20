import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';
import './FormAdmin.css';
import config from '../../config';

const FormAdmin = ({ onClose, onSubmitSuccess }) => {

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
    const [productImages, setProductImages] = useState([]);
    const [customerImages, setCustomerImages] = useState([]);
    const [customerImagesBack, setCustomerImagesBack] = useState([]);

    // Fetch categories from the database when the component mounts
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await axios.get(`${config.BASE_URL}/api/categories`);
                setCategories(response.data); // Set the fetched categories to state
            } catch (error) {
                console.error('Error fetching categories:', error);
            }
        };

        const fetchModels = async () => {
            try {
                const response = await axios.get(`${config.BASE_URL}/api/models`);
                setModels(response.data); // Set the fetched models to state
            } catch (error) {
                console.error('Error fetching models:', error);
            }
        };

        fetchCategories();
        fetchModels();
    }, []);

    const handleChange = async (e) => {
        const { id, value } = e.target;
        setFormData({
            ...formData,
            [id]: value,
        });

        if (id === 'nic') {
            if (value) {
                try {
                    const response = await axios.get(`${config.BASE_URL}/api/customer/${value}`);
                    if (response.data) {
                        setFormData(prevData => ({
                            ...prevData,
                            customerName: response.data.customerName,
                            address: response.data.address,
                            phone: response.data.phone,
                        }));
                    }
                } catch (error) {
                    setFormData(prevData => ({
                        ...prevData,
                        customerName: '',
                        address: '',
                        phone: '',
                    }));
                    if (error.response && error.response.status !== 404) {
                        console.error('Error fetching customer data:', error);
                    }
                }
            } else {
                // Clear the auto-filled fields when NIC is empty
                setFormData(prevData => ({
                    ...prevData,
                    customerName: '',
                    address: '',
                    phone: '',
                }));
            }
        }
    };

    const handleProductImageChange = (e) => {
        setProductImages([...e.target.files]);
    };

    const handleCustomerImageChange = (e) => {
        setCustomerImages([...e.target.files]);
    };
    const handleCustomerImageBackChange = (e) => {
        setCustomerImagesBack([...e.target.files]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formDataWithImages = new FormData();
        for (const key in formData) {
            formDataWithImages.append(key, formData[key]);
        }
        productImages.forEach((image) => {
            formDataWithImages.append('productImages', image);
        });
        customerImages.forEach((image) => {
            formDataWithImages.append('customerImages', image);
        });
        customerImagesBack.forEach((image) => {
            formDataWithImages.append('customerImagesBack', image);
        });

        try {
            const response = await axios.post(`${config.BASE_URL}/api/submit`, formDataWithImages, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            if (response.status === 201) {
                alert('Data submitted successfully!');
                onSubmitSuccess();
                onClose();
            } else {
                alert('Unexpected response from server');
            }
        } catch (error) {
            console.error('Error submitting data', error);
            // alert('Error submitting data');
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
                        <label htmlFor="customerImages" className="form-label" style={{ fontSize: '0.9rem' }}>nic</label>
                        <input
                            type="file"
                            className="form-control form-control-sm"
                            id="customerImages"
                            onChange={handleCustomerImageChange}
                            accept="image/*"
                            multiple
                        />
                    </div>

                    {/* <div className="mb-2">
                        <label htmlFor="customerImagesBack" className="form-label" style={{ fontSize: '0.9rem' }}>nic back</label>
                        <input 
                            type="file" 
                            className="form-control form-control-sm" 
                            id="customerImagesBack"
                            onChange={handleCustomerImageBackChange} 
                            accept="image/*" 
                            multiple
                            required
                        />
                    </div> */}


                    <div className="mb-2">
                        <label htmlFor="startDate" className="form-label" style={{ fontSize: '0.9rem' }}>Start Date</label>
                        <input
                            type="datetime-local"
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
                    </div >

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
                        <label htmlFor="itemNo" className="form-label" style={{ fontSize: '0.9rem' }}>Serial No/ IMEI </label>
                        <input
                            type="text"
                            className="form-control form-control-sm"
                            id="itemNo"
                            value={formData.itemNo}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="mb-2">
                        <label htmlFor="size" className="form-label" style={{ fontSize: '0.9rem' }}>Item Weight</label>
                        <input
                            type="text"
                            className="form-control form-control-sm"
                            id="size"
                            value={formData.size}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="mb-2">
                        <label htmlFor="productImages" className="form-label" style={{ fontSize: '0.9rem' }}>Product Images</label>
                        <input
                            type="file"
                            className="form-control form-control-sm"
                            id="productImages"
                            onChange={handleProductImageChange}
                            accept="image/*"
                            multiple
                        />
                    </div>

                    <div className="mb-2">
                        <label htmlFor="marketValue" className="form-label" style={{ fontSize: '0.9rem' }}>Estimate value</label>
                        <input
                            type="number"
                            className="form-control form-control-sm"
                            id="marketValue"
                            value={formData.marketValue}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="mb-2">
                        <label htmlFor="estimateValue" className="form-label" style={{ fontSize: '0.9rem' }}>Pawning Advance</label>
                        <input
                            type="number"
                            className="form-control form-control-sm"
                            id="estimateValue"
                            value={formData.estimateValue}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="text-center">
                        <button type="submit" className="btn btn-primary btn-sm">Submit</button>
                        <button type="button" className="btn btn-secondary btn-sm ms-2" onClick={onClose}>Cancel</button>
                    </div>
                </form >
            </div >
        </div >
    );
};

export default FormAdmin;
