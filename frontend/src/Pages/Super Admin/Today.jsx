import React, { useEffect, useState } from 'react';
import Sidebar from '../../components/Sidebar';
import axios from 'axios';
import './Products.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import config from '../../config';
import moment from 'moment-timezone';

const Today = () => {
    const [products, setProducts] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await axios.get(`${config.BASE_URL}/api/products`);
                setProducts(response.data);
            } catch (error) {
                console.error('Error fetching products:', error);
            }
        };

        fetchProducts();
    }, []);

    const handleSearchChange = (event) => {
        setSearchQuery(event.target.value.toLowerCase());
    };

    const filteredProducts = products.filter((product) => {
        const lowerCaseQuery = searchQuery.toLowerCase();
        const transactionDate = moment(product.dateTime).format('YYYY-MM-DD');
        const today = moment().format('YYYY-MM-DD');
        
        return (
            transactionDate === today && // Filter by today's transactions
            ((product.customerName || '').toLowerCase().includes(lowerCaseQuery) ||
            (product.nic || '').toLowerCase().includes(lowerCaseQuery) ||
            (product.itemName || '').toLowerCase().includes(lowerCaseQuery))
        );
    });

    const calculateTotals = () => {
        let totalEstimatePrice = 0;
        let totalPawningAdvance = 0;

        filteredProducts.forEach(product => {
            if (!['Release', 'Sold', 'Removed'].includes(product.status)) {
                totalEstimatePrice += product.marketValue || 0;
                totalPawningAdvance += product.estimateValue || 0;
            }
        });

        return {
            totalEstimatePrice,
            totalPawningAdvance
        };
    };
    const totals = calculateTotals();

    return (
        <div className="container-fluid">
            <div className="row flex-nowrap">
                <Sidebar />
                <div className="col py-3 content-area">
                    <h1 className="text-center caption mb-4">Today's Transactions</h1>

                    <div className="d-flex flex-column flex-md-row justify-content-between align-items-center mb-4">
                        <div className="input-group w-100 w-md-50 mb-3 mb-md-0">
                            <input type="text" className="form-control" placeholder="Search by Name, NIC, or Item Name"
                                value={searchQuery} onChange={handleSearchChange} />
                        </div>
                    </div>

                    <div className="table-responsive">
                        <table className="table table-striped table-hover small-table table-sm p-1">
                            <thead>
                                <tr>
                                    <th>Receipt No</th>
                                    <th>Name</th>
                                    <th>NIC</th>
                                    <th>Address</th>
                                    <th>Phone</th>
                                    <th>Item Category</th>
                                    <th>Item Model</th>
                                    <th>Item Name</th>
                                    <th>Item No</th>
                                    <th>Item Size</th>
                                    <th>Transaction Time</th>
                                    <th>Estimated Value</th>
                                    <th>Pawning Advance</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredProducts.map((product) => (
                                    <tr key={product.id}>
                                        <td>{product.recepitNo}</td>
                                        <td>{product.customerName}</td>
                                        <td>{product.nic}</td>
                                        <td>{product.address}</td>
                                        <td>{product.phone}</td>
                                        <td>{product.itemCategory}</td>
                                        <td>{product.itemModel}</td>
                                        <td>{product.itemName}</td>
                                        <td>{product.itemNo}</td>
                                        <td>{product.size}</td>
                                        <td>{moment(product.dateTime).format('YYYY-MM-DD HH:mm:ss')}</td>
                                        <td className="text-end">{product.marketValue.toLocaleString()}</td>
                                        <td className="text-end">{product.estimateValue.toLocaleString()}</td>
                                    </tr>
                                ))}
                            </tbody>

                            <tfoot>
                                <tr>
                                    <td colSpan="11" style={{ fontWeight: 'bold', textAlign: 'right' }}>Totals:</td>
                                    <td className="table-danger text-end">{totals.totalEstimatePrice.toLocaleString()}</td>
                                    <td className="table-primary text-end">{totals.totalPawningAdvance.toLocaleString()}</td>
                                </tr>
                            </tfoot>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Today;