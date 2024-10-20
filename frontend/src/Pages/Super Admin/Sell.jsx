import React, { useEffect, useState } from 'react';
import Sidebar from '../../components/Sidebar';
import axios from 'axios';
import './Products.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import config from '../../config';

const Sell = () => {
    const [products, setProducts] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await axios.get(`${config.BASE_URL}/api/products`);
                const soldProducts = response.data.filter(product => product.status === 'Sold');
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
            (product.buyerName || '').toLowerCase().includes(lowerCaseQuery) ||
            (product.buyerNic || '').toLowerCase().includes(lowerCaseQuery) ||
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
        const doc = new jsPDF({
            orientation: 'landscape', // Landscape orientation
            unit: 'mm', // Use mm for consistent measurement
            format: 'a4', // A4 format
            putOnlyUsedFonts: true,
            floatPrecision: 16,
        });
        
        const data = filterByDateRange();
    
        // Define table headers
        const headers = [["ID", "Receipt No", "Buyer Name", "Buyer NIC", "Category", "Model", "Item", "Item No", "Size", "Estimated Value", "Estimate Price", "Sold Date", "Sold Price", "Interest"]];
    
        // Define table rows
        const rows = data.map((product, index) => [
            index + 1,
            product.recepitNo,
            product.buyerName,
            product.buyerNic,
            product.itemCategory,
            product.itemModel,
            product.itemName,
            product.itemNo,
            product.size,
            product.marketValue,
            product.estimateValue,
            new Date(product.sellDate).toLocaleDateString('en-CA'),
            product.sellPrice,
            (parseFloat(product.sellPrice) - parseFloat(product.estimateValue)).toFixed(2)
        ]);
    
        // Create PDF table with custom width and smaller font size
        doc.autoTable({
            head: headers,
            body: rows,
            theme: 'grid',
            styles: { fontSize: 9 }, // Adjust font size as needed
            margin: { top: 30 },
            columnStyles: {
                // Adjust widths for long data
                0: { cellWidth: 8 },  // ID
                1: { cellWidth: 20 },  // Receipt No
                2: { cellWidth: 30 },  // Buyer Name
                3: { cellWidth: 15 },  // Buyer NIC
                4: { cellWidth: 18 },  // Category
                5: { cellWidth: 20 },  // Model
                6: { cellWidth: 15 },  // Item
                7: { cellWidth: 20 },  // Item No
                8: { cellWidth: 20 },  // Size
                9: { cellWidth: 20 },  // Estimated Value
                10: { cellWidth: 20 }, // Estimate Price
                11: { cellWidth: 20 }, // Sold Date
                12: { cellWidth: 20 }, // Sold Price
                13: { cellWidth: 20 }, // Interest
            },
            // Optionally set a min width to prevent squeezing
            minCellHeight: 8,
            cellWidth: 'auto',
        });
    
        // Save the PDF
        doc.save(`Sold_History_${startDate}_to_${endDate}.pdf`);
        setShowModal(false);
    };
    

    const calculateTotals = () =>{

        let totalPawningAdvance = 0;
        let totalSellPrice = 0;
        let totalProfitLoss = 0;

        filteredProducts.forEach(product => {
            
            totalPawningAdvance += product.estimateValue || 0;
            totalSellPrice += product.sellPrice || 0;
            totalProfitLoss += (product.sellPrice || 0) - (product.estimateValue || 0);
        });

        return {
            
            totalPawningAdvance,
            totalSellPrice,
            totalProfitLoss
        };
    };
    const totals = calculateTotals();

    return (
        <div className="container-fluid">
            <div className="row flex-nowrap">
                <Sidebar />
                <div className="col py-3 content-area">
                    <h1 className="text-center caption mb-4">Sold History</h1>

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


                                <h2 className="text-center mb-4">Generate Sell Report</h2>



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
                                    <th>Buyer Name</th>
                                    <th>Buyer NIC</th>
                                    <th>Buyer Address</th>
                                    <th>Buyer Phone</th>
                                    <th>Item Category</th>
                                    <th>Item Model</th>
                                    <th>Item Name</th>
                                    <th>Item Number</th>
                                    <th>Item Size</th>
                                    <th>Estimated Value</th>
                                    <th>Pawning Advance</th>
                                    <th>Sold Date</th>
                                    <th>Sold Price</th>
                                    <th>Interest</th>
                                    <th>Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredProducts.map((product, index) => (
                                    <tr key={product.id}>
                                        <td>{index + 1}</td>
                                        <td>{product.recepitNo}</td>
                                        <td>{product.buyerName}</td>
                                        <td>{product.buyerNic}</td>
                                        <td>{product.buyerAddress}</td>
                                        <td>{product.buyerPhone}</td>
                                        <td>{product.itemCategory}</td>
                                        <td>{product.itemModel}</td>
                                        <td>{product.itemName}</td>
                                        <td>{product.itemNo}</td>
                                        <td>{product.size}</td>
                                        <td>{product.marketValue}</td>
                                        <td>{product.estimateValue}</td>
                                        <td>{new Date(product.sellDate).toLocaleDateString('en-CA')}</td>

                                        <td>{product.sellPrice}</td>
                                        <td style={{ color: parseFloat(product.sellPrice) - parseFloat(product.estimateValue) >= 0 ? 'green' : 'red' }}>
                                            {(parseFloat(product.sellPrice) - parseFloat(product.estimateValue)).toFixed(2)}
                                        </td>
                                        <td style={{ color: 'blue', fontWeight: 'bold' }}>
                                            {product.status}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                            <tfoot>
                                <td colSpan='11' style={{fontWeight:'Bold', textAlign:'right'}}>Total:</td>
                                <td ></td>
                                <td className="table-danger">{totals.totalPawningAdvance}</td>
                                <td></td>
                                <td className="table-primary">{totals.totalSellPrice}</td>
                                <td className="table-primary">{totals.totalProfitLoss}</td>

                            </tfoot>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Sell;
