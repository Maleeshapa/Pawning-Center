import React, { useEffect, useState } from 'react';
import Sidebar from '../../components/Sidebar';
import axios from 'axios';
import './Products.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import ProductUpdateModal from '../Modals/productUpdateModal';
import ProductPawnModal from '../Modals/ProductPawnModal';
import ProductSellModal from '../Modals/ProductSellModal';
import ViewImage from '../Modals/ViewImage';
// import jsPDF from 'jspdf';
// import 'jspdf-autotable';
import config from '../../config';
import moment from 'moment-timezone';

const Products = () => {
    const [products, setProducts] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [sortOrder, setSortOrder] = useState('asc');
    const [sortColumn, setSortColumn] = useState('recepitNo');

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

    const sortProducts = (column) => {
        const newSortOrder = sortOrder === 'asc' ? 'desc' : 'asc';
        const sortedProducts = [...products].sort((a, b) => {
            if (newSortOrder === 'asc') {
                return a[column] > b[column] ? 1 : -1;
            } else {
                return a[column] < b[column] ? 1 : -1;
            }
        });

        setProducts(sortedProducts);
        setSortOrder(newSortOrder);
        setSortColumn(column);
    };


    const handleSearchChange = (event) => {
        setSearchQuery(event.target.value.toLowerCase());
    };

    const filteredProducts = products.filter((product) => {
        console.log('Product:', product); // Log the product
        const lowerCaseQuery = searchQuery.toLowerCase();
        return (
            (product.customerName || '').toLowerCase().includes(lowerCaseQuery) ||
            (product.nic || '').toLowerCase().includes(lowerCaseQuery) ||
            (product.itemName || '').toLowerCase().includes(lowerCaseQuery)
        );
    });


    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this product?')) {
            try {
                if (id === undefined || id === null) {
                    throw new Error('Invalid ID');
                }

                await axios.delete(`${config.BASE_URL}/api/products/${id}`);
                setProducts(products.filter(product => product.id !== id));
            } catch (error) {
                console.error('Error deleting product:', error);
            }
        }
    };


    const handleUpdate = (product) => {
        setSelectedProduct(product);
    };

    const formatDateForDb = (dateString) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        return date.toISOString().slice(0, 19).replace('T', ' '); // 'YYYY-MM-DD HH:MM:SS'
    };


    const handleSaveChanges = async () => {
        if (selectedProduct) {
            try {
                const response = await axios.put(`${config.BASE_URL}/api/products/${selectedProduct.id}`, selectedProduct, {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });

                console.log('Product updated:', response.data);
                setProducts(products.map(product => product.id === selectedProduct.id ? response.data : product));
                setSelectedProduct(null);

                const modal = document.getElementById('updateModal');
                const modalInstance = window.bootstrap.Modal.getInstance(modal);
                if (modalInstance) {
                    modalInstance.hide();
                    window.location.reload();
                }
            } catch (error) {
                console.error('Error updating product:', error.response ? error.response.data : error.message);
            }
        }
    };


    const [showPawnModal, setShowPawnModal] = useState(false);
    const [pawnProduct, setPawnProduct] = useState(null);

    const handlePawnPayClick = (product) => {
        setPawnProduct(product);
        setShowPawnModal(true);
    };


    const handlePawnPay = (data) => {
        console.log('Pawn Pay Data:', data);
        // Here you can handle the actual saving logic
        // For example, send the pawn pay data to the backend
        handleClosePawnModal(); // Close the modal after saving
    };

    const handleClosePawnModal = () => {
        setShowPawnModal(false);
        setPawnProduct(null);
    };

    const [showSellModal, setShowSellModal] = useState(false);
    const [sellProduct, setSellProduct] = useState(null);

    const handleSellClick = (product) => {
        setSellProduct(product);
        setShowSellModal(true);
    };


    const handleSell = (data) => {
        console.log('Sell Data:', data);
        // Here you can handle the actual saving logic
        // For example, send the pawn pay data to the backend
        handleCloseSellModal(); // Close the modal after saving
    };

    const handleCloseSellModal = () => {
        setShowSellModal(false);
        setSellProduct(null);
    };

    const [showImageModal, setShowImageModal] = useState(false);

    const handleViewImage = (product) => {
        setSelectedProduct(product);
        setShowImageModal(true);
    };

    const removeItem = async (product) => {
        try {
            const response = await axios.put(`${config.BASE_URL}/api/remove-item/${product.id}`, {}, {
                headers: { 'Content-Type': 'application/json' },
            });
            if (response.status === 200) {
                alert('Item Removed successfully');
                // Update the local state to reflect the change
                setProducts(products.map(p =>
                    p.id === product.id ? { ...p, status: 'Removed' } : p
                ));
            } else {
                alert('Failed to remove item');
            }
        } catch (error) {
            console.error('Error removing item:', error);
            alert('Error removing item');
        }
    };

    const calculateTotals = () => {
        let totalEstimatePrice = 0;
        let totalPawningAdvance = 0;


        filteredProducts.forEach(product => {
            if (!['Release', 'Sold', 'Removed'].includes(product.status)){
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
                    <h1 className="text-center caption mb-4">ගනුදෙනු විස්තර</h1>

                    <div className="d-flex flex-column flex-md-row justify-content-between align-items-center mb-4">
                        <div className="input-group w-100 w-md-50 mb-3 mb-md-0">
                            <input type="text" className="form-control " placeholder="Search by Name, NIC, or Item Name"
                                value={searchQuery} onChange={handleSearchChange} />
                        </div>


                    </div>

                    <div className="table-responsive">
                        <table className="table table-striped table-hover small-table table-sm p-1">
                            <thead>
                                <tr>
                                    {/* <th>ID</th> */}
                                    <th onClick={() => sortProducts('recepitNo')} style={{ cursor: 'pointer' }}>
                                        Receipt Number
                                        {sortColumn === 'recepitNo' && (
                                            <span className={`ms-2 ${sortOrder === 'asc' ? 'bi bi-arrow-up' : 'bi bi-arrow-down'}`} />
                                        )}
                                    </th>
                                    <th>Name</th>
                                    <th>NIC</th>
                                    <th>Address</th>
                                    <th>Phone</th>
                                    <th>Item Category</th>
                                    <th>Item Model</th>
                                    <th>Item Name</th>
                                    <th>Item Number</th>
                                    <th>Item Size</th>
                                    <th>Estimated Value</th>
                                    <th>Pawning Advance</th>
                                    <th>Start Date</th>
                                    <th>End Date</th>
                                    {/* <th>Interest %</th>
                                    <th>Total Price</th> */}
                                    <th>පින්තූරය</th>
                                    <th>Status</th>
                                    <th>Actions</th>
                                    <th> </th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredProducts.map((product, index) => (
                                    <tr key={product.id}>
                                        {/* <td>{index + 1}</td> */}
                                        <td> {product.recepitNo}</td>
                                        <td>{product.customerName}</td>
                                        <td>{product.nic}</td>
                                        <td>{product.address}</td>
                                        <td>{product.phone}</td>
                                        <td>{product.itemCategory}</td>
                                        <td> {product.itemModel}</td>
                                        <td>{product.itemName}</td>
                                        <td> {product.itemNo}</td>
                                        <td> {product.size}</td>
                                        <td>{product.marketValue}</td>
                                        <td>{product.estimateValue}</td>
                                        <td>{moment(product.startDate).format('YYYY-MM-DD HH:mm:ss')}</td>
                                        <td>{product.endDate ? moment(product.endDate).tz('Asia/Colombo').format('YYYY-MM-DD HH:mm:ss') : 'N/A'}</td>


                                        <td><button type="button" class="btn btn-sm" data-bs-toggle="modal" data-bs-target="#imageModal" onClick={() => handleViewImage(product)}>
                                            <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="30" height="30" viewBox="0 0 50 50">
                                                <path d="M 14 4 C 8.486 4 4 8.486 4 14 L 4 36 C 4 41.514 8.486 46 14 46 L 36 46 C 41.514 46 46 41.514 46 36 L 46 14 C 46 8.486 41.514 4 36 4 L 14 4 z M 21.132812 13 L 28.867188 13 C 29.740188 13 30.560719 13.464891 31.011719 14.212891 L 32.845703 17.273438 C 33.114703 17.721438 33.608812 18 34.132812 18 L 39.5 18 C 40.327 18 41 18.673 41 19.5 L 41 35.5 C 41 36.327 40.327 37 39.5 37 L 10.5 37 C 9.673 37 9 36.327 9 35.5 L 9 19.5 C 9 18.673 9.673 18 10.5 18 L 15.867188 18 C 16.390187 18 16.885297 17.721484 17.154297 17.271484 L 18.988281 14.212891 C 19.438281 13.464891 20.259812 13 21.132812 13 z M 12 14 L 14 14 C 14.552 14 15 14.448 15 15 L 15 16 L 11 16 L 11 15 C 11 14.448 11.448 14 12 14 z M 34 19.5 A 1 1 0 0 0 34 21.5 A 1 1 0 0 0 34 19.5 z M 25 20 C 20.864 20 17.5 23.364 17.5 27.5 C 17.5 31.636 20.864 35 25 35 C 29.136 35 32.5 31.636 32.5 27.5 C 32.5 23.364 29.136 20 25 20 z M 25 22 C 28.032 22 30.5 24.468 30.5 27.5 C 30.5 30.532 28.032 33 25 33 C 21.968 33 19.5 30.532 19.5 27.5 C 19.5 24.468 21.968 22 25 22 z"></path>
                                            </svg>
                                        </button></td>
                                        {/* <td>{product.interest}</td>
                                        <td>{product.totalPrice}</td> */}
                                        {/* <td>{product.status}</td> */}


                                        <td
                                            style={{
                                                color:
                                                    product.status === 'Release'
                                                        ? 'green'
                                                        : product.status === 'Sold'
                                                            ? 'blue'
                                                            : product.status === 'Removed'
                                                                ? 'orange'
                                                                : 'red',
                                                fontWeight: 'bold',
                                            }}
                                        >
                                            {product.status || 'ගෙවලා නැති'}
                                        </td>



                                        <td>

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

                                            {product.status === 'Release' || product.status === 'Sold' ? (
                                                <div>
                                                    <button className="btn btn-secondary me-2 btn-sm">
                                                        උකස් ගෙවීම
                                                    </button>

                                                    <button className="btn btn-secondary me-2 btn-sm">
                                                        විකුනීම
                                                    </button>

                                                    <button className="btn btn-secondary btn-sm">
                                                        භාන්ඩ ඉවත් කිරීම
                                                    </button>
                                                </div>
                                            ) : (
                                                <>
                                                    <button className="btn btn-success me-2 btn-sm" data-bs-toggle="modal" data-bs-target="#pawnPayModal" onClick={() => handlePawnPayClick(product)}>
                                                        උකස් ගෙවීම
                                                    </button>

                                                    <button className="btn btn-primary me-2 btn-sm" data-bs-toggle="modal" data-bs-target="#sellModal" onClick={() => handleSellClick(product)}>
                                                        විකුනීම
                                                    </button>

                                                    <button className="btn btn-warning btn-sm" onClick={() => removeItem(product)}>
                                                        භාන්ඩ ඉවත් කිරීම
                                                    </button>
                                                </>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>

                            <tfoot>
                                <tr>
                                    <td colSpan="10" style={{ fontWeight: 'bold', textAlign: 'right' }}>Totals:</td>
                                    <td className="table-danger">{totals.totalEstimatePrice.toFixed(2)}</td>

                                    <td className="table-primary">{totals.totalPawningAdvance.toFixed(2)}</td>

                                    <td></td>
                                </tr>
                            </tfoot>



                        </table>
                    </div>

                    {/* Update Modal */}
                    <ProductUpdateModal
                        selectedProduct={selectedProduct}
                        setSelectedProduct={setSelectedProduct}
                        handleSaveChanges={handleSaveChanges}
                    />

                    <ProductPawnModal
                        selectedProduct={pawnProduct}
                        handleClose={handleClosePawnModal}
                        handlePawnPay={handlePawnPay}
                    />

                    <ProductSellModal
                        selectedProduct={sellProduct}
                        handleClose={handleCloseSellModal}
                        handleSell={handleSell}
                    />
                    <ViewImage
                        selectedProduct={selectedProduct}
                        onClose={() => setShowImageModal(false)}
                    />

                </div>
            </div>
        </div>
    );
};

export default Products;
