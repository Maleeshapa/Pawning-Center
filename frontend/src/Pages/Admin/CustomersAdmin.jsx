import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './Customers.css'
import SidebarAdmin from '../../components/SidebarAdmin';
import FormAdmin from './FormAdmin';
import config from '../../config'

const CustomersAdmin = () => {
    const [customers, setCustomers] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCustomer, setSelectedCustomer] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [openModal, setOpenModal] = useState(false);

    useEffect(() => {
        const fetchCustomers = async () => {
            try {
                const response = await axios.get(`${config.BASE_URL}/api/customers`);
                setCustomers(response.data);
            } catch (error) {
                console.error('Error fetching customers:', error);
            }
        };

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
                setCustomers(customers.filter(customer => customer.id !== id)); // Update local state
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
        setSelectedCustomer(null);
        setOpenModal(true);
    };

    return (
        <div className="container-fluid">
            <div className="row flex-nowrap">
                <SidebarAdmin />
                <div className="col py-3 content-area">
                    <h1 className="text-center mb-4 caption">Customer Details</h1>

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
                                Add Customer
                            </button>
                        </div>
                    </div>

                    <div className="table-responsive">
                        <table className="table table-striped table-hover">
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Name</th>
                                    <th>NIC</th>
                                    <th>Address</th>
                                    <th>Phone</th>
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
                                                className="btnDel btn-sm " disabled
                                                onClick={() => handleDelete(customer.id)}
                                            >
                                                Delete
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
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


                    {openModal && (
                        <FormAdmin onClose={() => setOpenModal(false)} />
                    )}

                </div>
            </div>
        </div>
    );
};

export default CustomersAdmin;
