import React, { useEffect, useState } from 'react';
import Sidebar from '../../components/Sidebar';
import axios from 'axios';
import './Customers.css';
import Form from './Form';
import ViewId from '../Modals/ViewId'
import config from '../../config';

const Customers = () => {
    const [customers, setCustomers] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCustomer, setSelectedCustomer] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [openModal, setOpenModal] = useState(false); // Ensure this state is defined

    const fetchCustomers = async () => {
        try {
            const response = await axios.get(`${config.BASE_URL}/api/customers`);
            setCustomers(response.data);
        } catch (error) {
            console.error('Error fetching customers:', error);
        }
    };

    useEffect(() => {
        fetchCustomers();
    }, []);

    // Filter customers based on search term
    const filteredCustomers = customers.filter(customer =>
        customer.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        customer.nic.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Handle delete
    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this customer?')) {
            try {
                await axios.delete(`${config.BASE_URL}/api/customers/${id}`);
                setCustomers(customers.filter(customer => customer.id !== id));
            } catch (error) {
                console.error('Error deleting customer:', error);
            }
        }
    };

    // Handle update
    const handleUpdate = async () => {
        if (selectedCustomer) {
            try {
                await axios.put(`${config.BASE_URL}/api/customers/${selectedCustomer.id}`, selectedCustomer);
                setCustomers(customers.map(customer =>
                    customer.id === selectedCustomer.id ? selectedCustomer : customer
                ));
                setShowModal(false);
            } catch (error) {
                console.error('Error updating customer:', error);
            }
        }
    };

    const handleAddCustomer = () => {
        setSelectedCustomer(null); // Reset selected customer
        setOpenModal(true); // Show Add Customer modal
    };

    const handleFormSubmitSuccess = () => {
        fetchCustomers(); // Refresh the customer list
    };

    const [showImageIdModal, setShowImageIdModal] = useState(false);

    const handleViewImage = (customer) => {
        setSelectedCustomer(customer);
        setShowImageIdModal(true);
    };

    return (
        <div className="container-fluid">
            <div className="row flex-nowrap">
                <Sidebar />
                <div className="col py-3 content-area">
                    <h1 className="text-center mb-4 caption">පාරිභොගික විස්තර</h1>

                    <div className="d-flex flex-column flex-md-row justify-content-between align-items-center mb-4">
                        <div className="input-group w-100 w-md-50 mb-3 mb-md-0">
                            <input
                                type="search"
                                className="form-control"
                                id="datatable-search-input"
                                placeholder="Search Name or Nic"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>

                        <div className="ms-md-3 mt-3 mt-md-0">
                            <button className="btnAdd btnall btn-sm" onClick={handleAddCustomer}>
                                නව ගනුදෙනුවක්+
                            </button>
                        </div>
                    </div>

                    <div className="table-responsive">
                        <table className="table table-striped table-hover">
                            <thead>
                                <tr>
                                    <th>අංකය</th>
                                    <th>නම</th>
                                    <th>ජා:හැදුනුම්පත</th>
                                    <th>ලිපිනය</th>
                                    <th>දුරකතනය</th>
                                    <th>ජා:හැ පීන්තුරය</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredCustomers.map((customer, index) => (
                                    <tr key={customer.id}>
                                        <td>{index + 1}</td>
                                        <td>{customer.customerName}</td>
                                        <td>{customer.nic}</td>
                                        <td>{customer.address}</td>
                                        <td>{customer.phone}</td>
                                        <td><button type="button" class="btn btn-sm" data-bs-toggle="modal" data-bs-target="#imageIdModal" onClick={() => handleViewImage(customer)}>
                                            <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="25" height="25" viewBox="0 0 50 50">
                                                <path d="M 14 4 C 8.486 4 4 8.486 4 14 L 4 36 C 4 41.514 8.486 46 14 46 L 36 46 C 41.514 46 46 41.514 46 36 L 46 14 C 46 8.486 41.514 4 36 4 L 14 4 z M 21.132812 13 L 28.867188 13 C 29.740188 13 30.560719 13.464891 31.011719 14.212891 L 32.845703 17.273438 C 33.114703 17.721438 33.608812 18 34.132812 18 L 39.5 18 C 40.327 18 41 18.673 41 19.5 L 41 35.5 C 41 36.327 40.327 37 39.5 37 L 10.5 37 C 9.673 37 9 36.327 9 35.5 L 9 19.5 C 9 18.673 9.673 18 10.5 18 L 15.867188 18 C 16.390187 18 16.885297 17.721484 17.154297 17.271484 L 18.988281 14.212891 C 19.438281 13.464891 20.259812 13 21.132812 13 z M 12 14 L 14 14 C 14.552 14 15 14.448 15 15 L 15 16 L 11 16 L 11 15 C 11 14.448 11.448 14 12 14 z M 34 19.5 A 1 1 0 0 0 34 21.5 A 1 1 0 0 0 34 19.5 z M 25 20 C 20.864 20 17.5 23.364 17.5 27.5 C 17.5 31.636 20.864 35 25 35 C 29.136 35 32.5 31.636 32.5 27.5 C 32.5 23.364 29.136 20 25 20 z M 25 22 C 28.032 22 30.5 24.468 30.5 27.5 C 30.5 30.532 28.032 33 25 33 C 21.968 33 19.5 30.532 19.5 27.5 C 19.5 24.468 21.968 22 25 22 z"></path>
                                            </svg>
                                        </button></td>
                                        <td>
                                            <button
                                                className="btnUpdate btn-sm me-2"
                                                onClick={() => {
                                                    setSelectedCustomer(customer);
                                                    setShowModal(true);
                                                }}
                                            >
                                                Update
                                            </button>
                                            <button
                                                className="btnDelete btn-danger btn-sm"
                                                onClick={() => handleDelete(customer.id)}
                                            >
                                                Delete
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        <ViewId
                            selectedCustomer={selectedCustomer}
                            onClose={() => setShowImageIdModal(false)}
                        />
                    </div>

                    {/* Update Modal */}
                    {showModal && (
                        <div className="modal fade show" style={{ display: 'block' }} role="dialog">
                            <div className="modal-dialog" role="document">
                                <div className="modal-content">
                                    <div className="modal-header">
                                        <h5 className="modal-title">Update Customer</h5>
                                        <button type="button" className="btn-close" onClick={() => setShowModal(false)}></button>
                                    </div>
                                    <div className="modal-body">
                                        {selectedCustomer && (
                                            <div>
                                                <div className="mb-3">
                                                    <label htmlFor="name" className="form-label">Name</label>
                                                    <input
                                                        type="text"
                                                        id="name"
                                                        className="form-control"
                                                        value={selectedCustomer.customerName}
                                                        onChange={(e) => setSelectedCustomer({ ...selectedCustomer, customerName: e.target.value })}
                                                    />
                                                </div>
                                                <div className="mb-3">
                                                    <label htmlFor="nic" className="form-label">NIC</label>
                                                    <input
                                                        type="text"
                                                        id="nic"
                                                        className="form-control"
                                                        value={selectedCustomer.nic}
                                                        onChange={(e) => setSelectedCustomer({ ...selectedCustomer, nic: e.target.value })}
                                                    />
                                                </div>
                                                <div className="mb-3">
                                                    <label htmlFor="address" className="form-label">Address</label>
                                                    <input
                                                        type="text"
                                                        id="address"
                                                        className="form-control"
                                                        value={selectedCustomer.address}
                                                        onChange={(e) => setSelectedCustomer({ ...selectedCustomer, address: e.target.value })}
                                                    />
                                                </div>
                                                <div className="mb-3">
                                                    <label htmlFor="phone" className="form-label">Phone</label>
                                                    <input
                                                        type="text"
                                                        id="phone"
                                                        className="form-control"
                                                        value={selectedCustomer.phone}
                                                        onChange={(e) => setSelectedCustomer({ ...selectedCustomer, phone: e.target.value })}
                                                    />
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                    <div className="modal-footer">
                                        <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>Close</button>
                                        <button type="button" className="btn btn-primary" onClick={handleUpdate}>Save changes</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Add Customer Modal */}
                    {openModal && (
                        <Form onClose={() => setOpenModal(false)}
                            onSubmitSuccess={handleFormSubmitSuccess} />
                    )}
                </div>
            </div>
        </div>
    );
};

export default Customers;
