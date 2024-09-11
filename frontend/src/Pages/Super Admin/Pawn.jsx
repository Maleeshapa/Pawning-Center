import React, { useEffect, useState } from 'react';
import Sidebar from '../../components/Sidebar';
import axios from 'axios';
import './Products.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

const Pawn = () => {
    const [products, setProducts] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/products');
                const soldProducts = response.data.filter(product => product.status === 'Pawned');
                setProducts(soldProducts);
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
        return (
            (product.customerName || '').toLowerCase().includes(lowerCaseQuery) ||
            (product.nic || '').toLowerCase().includes(lowerCaseQuery) ||
            (product.itemName || '').toLowerCase().includes(lowerCaseQuery)
        );
    });

    // Step 2: Filter products by date range
    const filterByDateRange = () => {
        const start = new Date(startDate);
        const end = new Date(endDate);
        return filteredProducts.filter(product => {
            const sellDate = new Date(product.sellDate);
            return sellDate >= start && sellDate <= end;
        });
    };

    // Step 3: Generate PDF
    const generatePDF = () => {
        const doc = new jsPDF();
        const data = filterByDateRange();

        // Define table headers
        const headers = [["ID", "Receipt No", "Customer Name", "Customer NIC", "Category", "Model", "Item", "Item No", "Size", "Market Price", "Estimate Price"]];

        // Define table rows
        const rows = data.map((product, index) => [
            index + 1,
            product.recepitNo,
            product.customerName,
            product.nic,
            product.itemCategory,
            product.itemModel,
            product.itemName,
            product.itemNo,
            product.size,
            product.marketValue,
            product.estimateValue,
            
        ]);

        // Create PDF table
        doc.autoTable({
            head: headers,
            body: rows,
        });

        // Save the PDF
        doc.save(`Pawn_History_${startDate}_to_${endDate}.pdf`);
        setShowModal(false);
    };

    return (
        <div className="container-fluid">
            <div className="row flex-nowrap">
                <Sidebar />
                <div className="col py-3 content-area">
                    <h1 className="text-center caption mb-4">Pawn History</h1>

                    <div className="d-flex flex-column flex-md-row justify-content-between align-items-center mb-4">
                        <div className="input-group w-100 w-md-50 mb-3 mb-md-0">
                            <input type="text" className="form-control" placeholder="Search by Name, NIC, or Item Name"
                                value={searchQuery} onChange={handleSearchChange} />
                        </div>
                        <button
                            className="btn btn-primary btn-sm me-2"
                            onClick={() => { setShowModal(true); }}
                        >
                            Generate Report
                        </button>
                    </div>

                    {/* Date Range Modal */}
                    {showModal && (
                        <div className="modal-container">
                            <div className="modal-content">
                                
                                    
                                    <h2 className="text-center mb-4">Generate Pawn Report</h2>
                                    
                                    
                                    
                                    <div className="modal-body">
                                        <div className="mb-3">
                                        <label htmlFor="startDate" className="form-label">From</label>
                                            <input
                                                type="date"
                                                className="form-control"
                                                id="startDate"
                                                value={startDate}
                                                onChange={(e) => setStartDate(e.target.value)}
                                            />
                                        </div>
                                        <div className="mb-3">
                                        <label htmlFor="endDate" className="form-label">To</label>
                                            <input
                                                type="date"
                                                className="form-control"
                                                id="endDate"
                                                value={endDate}
                                                onChange={(e) => setEndDate(e.target.value)}
                                            />
                                        </div>
                                    </div>
                                    <div className="d-flex justify-content-end">
                                        <button className="btn btn-secondary me-2" onClick={() => setShowModal(false)}>Close</button>
                                        <button className="btn btn-primary" onClick={generatePDF}>Download Report</button>
                                    </div>
                                
                            </div>
                        </div>
                    )}

                    <div className="table-responsive">
                        <table className="table table-striped table-hover small-table table-sm p-1">
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Receipt No</th>
                                    <th>Customer Name</th>
                                    <th>Customer NIC</th>
                                    
                                    <th>Item Category</th>
                                    <th>Item Model</th>
                                    <th>Item Name</th>
                                    <th>Item Number</th>
                                    <th>Item Size</th>

                                    <th>Start Date</th>
                                    <th>End Date</th>

                                    <th>Market price</th>
                                    <th>Estimated Price</th>
                                    
                                    <th>Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredProducts.map((product, index) => (
                                    <tr key={product.id}>
                                        <td>{index + 1}</td>
                                        <td>{product.recepitNo}</td>
                                        <td>{product.customerName}</td>
                                        <td>{product.nic}</td>
                                       
                                        <td>{product.itemCategory}</td>
                                        <td>{product.itemModel}</td>
                                        <td>{product.itemName}</td>
                                        <td>{product.itemNo}</td>
                                        <td>{product.size}</td>

                                        <td>{new Date(product.startDate).toLocaleDateString()}</td>
                                        <td>{product.endDate ? new Date(product.endDate).toLocaleDateString() : 'N/A'}</td>

                                        <td>{product.marketValue}</td>
                                        <td>{product.estimateValue}</td>
                                        
                                        <td style={{ color: 'blue', fontWeight: 'bold' }}>
                                            {product.status}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Pawn;
