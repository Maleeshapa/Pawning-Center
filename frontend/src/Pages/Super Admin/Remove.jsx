import React, { useEffect, useState } from 'react';
import Sidebar from '../../components/Sidebar';
import axios from 'axios';
import './Products.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
// import jsPDF from 'jspdf';
// import 'jspdf-autotable';
import config from '../../config';

const Remove = () => {
    const [products, setProducts] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await axios.get(`${config.BASE_URL}/api/products`);
                const removedProducts = response.data.filter(product => product.status === 'Removed');
                setProducts(removedProducts);
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
        console.log('Product:', product); // Log the product
        const lowerCaseQuery = searchQuery.toLowerCase();
        return (
            (product.buyerName || '').toLowerCase().includes(lowerCaseQuery) ||
            (product.buyernic || '').toLowerCase().includes(lowerCaseQuery) ||
            (product.itemName || '').toLowerCase().includes(lowerCaseQuery)
        );
    });


    // const handleDelete = async (id) => {
    //     if (window.confirm('Are you sure you want to delete this product?')) {
    //         try {
    //             if (id === undefined || id === null) {
    //                 throw new Error('Invalid ID');
    //             }

    //             await axios.delete(`${config.BASE_URL}/api/products/${id}`);
    //             setProducts(products.filter(product => product.id !== id));
    //         } catch (error) {
    //             console.error('Error deleting product:', error);
    //         }
    //     }
    // };


    const formatDateForDb = (dateString) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        return date.toISOString().slice(0, 19).replace('T', ' '); // 'YYYY-MM-DD HH:MM:SS'
    };


    const calculateTotals = () => {
        let totalLoss = 0;

        filteredProducts.forEach(product => {
            totalLoss += product.estimateValue || 0;
            
        });

        return {
            totalLoss
        };

    };
    const totals = calculateTotals();

    return (
        <div className="container-fluid">
            <div className="row flex-nowrap">
                <Sidebar />
                <div className="col py-3 content-area">
                    <h1 className="text-center caption mb-4">Removed Item History</h1>

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
                                    <th>ID</th>
                                    <th>Receipt Number</th>
                                    <th>Customer Name</th>
                                    <th>Item Category</th>
                                    <th>Item Model</th>
                                    <th>Item Name</th>
                                    <th>Item Number</th>
                                    <th>Item Size</th>
                                    <th>Estimated Value</th>
                                    <th>Pawning Advance (Loss) </th>
                                    <th>Status</th>

                                    <th> </th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredProducts.map((product, index) => (
                                    <tr key={product.id}>
                                        <td>{index + 1}</td>
                                        <td> {product.recepitNo}</td>
                                        <td>{product.customerName}</td>

                                        <td>{product.itemCategory}</td>
                                        <td> {product.itemModel}</td>
                                        <td>{product.itemName}</td>
                                        <td> {product.itemNo}</td>
                                        <td> {product.size}</td>

                                        <td>{product.marketValue}</td>
                                        <td style={{
                                            color: 'red',
                                            fontWeight: 'bold',
                                        }}>{product.estimateValue}</td>


                                        <td
                                            style={{
                                                color: 'orange',
                                                fontWeight: 'bold',
                                            }}
                                        >
                                            {product.status}
                                        </td>



                                        {/* <td>

                                            <button type="button" class="btn btn-secondary btn-sm" data-bs-toggle="modal" data-bs-target="#updateModal" onClick={() => handleUpdate(product)}>
                                                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" class="bi bi-pencil-fill" viewBox="0 0 16 16">
                                                    <path d="M12.854.146a.5.5 0 0 0-.707 0L10.5 1.793 14.207 5.5l1.647-1.646a.5.5 0 0 0 0-.708zm.646 6.061L9.793 2.5 3.293 9H3.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.207zm-7.468 7.468A.5.5 0 0 1 6 13.5V13h-.5a.5.5 0 0 1-.5-.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.5-.5V10h-.5a.5.5 0 0 1-.175-.032l-.179.178a.5.5 0 0 0-.11.168l-2 5a.5.5 0 0 0 .65.65l5-2a.5.5 0 0 0 .168-.11z"></path>
                                                </svg>
                                            </button>

                                            {' '}

                                            <button type="button" class="btn btn-secondary btn-sm" onClick={() => handleDelete(product.id)}>
                                                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" class="bi bi-trash3" viewBox="0 0 16 16">
                                                    <path d="M6.5 1h3a.5.5 0 0 1 .5.5v1H6v-1a.5.5 0 0 1 .5-.5M11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3A1.5 1.5 0 0 0 5 1.5v1H1.5a.5.5 0 0 0 0 1h.538l.853 10.66A2 2 0 0 0 4.885 16h6.23a2 2 0 0 0 1.994-1.84l.853-10.66h.538a.5.5 0 0 0 0-1zm1.958 1-.846 10.58a1 1 0 0 1-.997.92h-6.23a1 1 0 0 1-.997-.92L3.042 3.5zm-7.487 1a.5.5 0 0 1 .528.47l.5 8.5a.5.5 0 0 1-.998.06L5 5.03a.5.5 0 0 1 .47-.53Zm5.058 0a.5.5 0 0 1 .47.53l-.5 8.5a.5.5 0 1 1-.998-.06l.5-8.5a.5.5 0 0 1 .528-.47M8 4.5a.5.5 0 0 1 .5.5v8.5a.5.5 0 0 1-1 0V5a.5.5 0 0 1 .5-.5"></path>
                                                </svg>
                                            </button>



                                        </td>


                                        <td>

                                            <button className="btn btn-success me-2 btn-sm" data-bs-toggle="modal" data-bs-target="#pawnPayModal" onClick={() => handlePawnPayClick(product)}>
                                                Pawn Pay
                                            </button>


                                            <button className="btn btn-primary me-2 btn-sm" data-bs-toggle="modal" data-bs-target="#sellModal" onClick={() => handleSellClick(product)}>
                                                විකුනීම
                                            </button>

                                            <button className="btn btn-warning btn-sm"  onClick={() => removeItem(product)} >
                                                Remove item
                                            </button>


                                        </td> */}
                                    </tr>
                                ))}
                            </tbody>
                            <tfoot>
                                <td colSpan='8' style={{fontWeight:'bold',textAlign:'right'}}>Total Loss:</td>
                                <td></td>
                                <td style={{fontWeight:'bold'}}> {totals.totalLoss} </td>
                            </tfoot>
                        </table>
                    </div>


                </div>
            </div>
        </div>
    );
};

export default Remove;
