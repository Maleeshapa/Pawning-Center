import { NavLink } from 'react-router-dom';  // Import NavLink
import './Dashboard.css';
import Sidebar from '../../components/Sidebar';
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Dashboard = () => {
    const [products, setProducts] = useState([]);
    const [totalProfit, setTotalProfit] = useState(0);
    const [totalRevenue, setTotalRevenue] = useState(0);
    const [customerCount, setCustomerCount] = useState(0);

    useEffect(() => {
        // Fetch products data from the API
        axios.get('http://localhost:5000/api/products')
            .then(response => {
                const productsData = response.data;
                setProducts(productsData);

                // Calculate total profit and total revenue
                const totalProfit = productsData.reduce((acc, product) =>
                    acc + (product.sellPrice - product.customerPaid - product.discount - product.estimateValue || 0),
                    0
                );

                const totalRevenue = productsData.reduce((acc, product) =>
                    acc + (product.sellPrice - product.customerPaid || 0),
                    0
                );

                setTotalProfit(totalProfit);
                setTotalRevenue(totalRevenue);
            })
            .catch(error => {
                console.error('Error fetching products:', error);
            });
    }, []);

    useEffect(() => {
        const fetchCustomerCount = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/customers');
                const customers = response.data;

                // Count unique customers by customerName
                const uniqueCustomers = new Set(customers.map(item => item.customerName));
                setCustomerCount(uniqueCustomers.size);
            } catch (error) {
                console.error('Error fetching customer count:', error);
            }
        };

        fetchCustomerCount();
    }, []);

    return (
        <div className="container-fluid">
            <div className="row flex-nowrap">
                <Sidebar />
                <div className="col py-3 content-area">
                    <h3 className='caption'>Dashboard</h3>
                    <main className="col-md-12 p-3 bg-white">
                        <div>
                            <p>Total Profit: ${totalProfit.toFixed(2)}</p>
                            <p>Total Revenue: ${totalRevenue.toFixed(2)}</p>
                        </div>
                        <div className="row">
                            <div className="col-md-4">
                                <div className="stats-box">
                                    <h4>Customer Count</h4>
                                    <p>{customerCount}</p>
                                </div>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-md-4 mb-3" id="dMain">
                                <NavLink
                                    to="/Customers"
                                    className="p-3 tabs cusTab d-flex align-items-center justify-content-center text-decoration-none"
                                >
                                    පාරිභොගික විස්තර
                                </NavLink>
                            </div>
                            <div className="col-md-4 mb-3" id="dMain">
                                <NavLink
                                    to="/Products"
                                    className="p-3 tabs addTab d-flex align-items-center justify-content-center text-decoration-none"
                                >
                                    ගනුදෙනු විස්තර
                                </NavLink>
                            </div>
                            <div className="col-md-4 mb-3" id="dMain">
                                <NavLink
                                    to="/CreateAdmin"
                                    className="p-3 tabs createAdTab d-flex align-items-center justify-content-center text-decoration-none"
                                >
                                    Create Admins
                                </NavLink>
                            </div>
                            <div className="col-md-4 mb-3" id="dMain">
                                <NavLink
                                    to="/Pawn"
                                    className="p-3 tabs reportTab d-flex align-items-center justify-content-center text-decoration-none"
                                >
                                    උකස් ගනුදෙනු ඉතිහසය
                                </NavLink>
                            </div>
                            <div className="col-md-4 mb-3" id="dMain">
                                <NavLink
                                    to="/sell"
                                    className="p-3 tabs pawnTab d-flex align-items-center justify-content-center text-decoration-none"
                                >
                                    විකුනුම් ඉතිහසය
                                </NavLink>
                            </div>
                            <div className="col-md-4 mb-3" id="dMain">
                                <NavLink
                                    to="/Remove"
                                    className="p-3 tabs removeTab d-flex align-items-center justify-content-center text-decoration-none"
                                >
                                    ඉවත්කල භන්ඩ විස්තර
                                </NavLink>
                            </div>
                            <div className="col-md-4 mb-3" id="dMain">
                                <NavLink
                                    to="/item"
                                    className="p-3 tabs removeTab d-flex align-items-center justify-content-center text-decoration-none"
                                >
                                    නව අයිතම +
                                </NavLink>
                            </div>
                        </div>
                    </main>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
