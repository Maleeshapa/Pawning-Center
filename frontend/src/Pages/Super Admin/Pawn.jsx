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
                console.log('Fetched products:', soldProducts);
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
    
        // Filter based on product's startDate and endDate
        const filtered = filteredProducts.filter(product => {
            const productStartDate = new Date(product.startDate);
            const productEndDate = new Date(product.endDate);
    
            if (isNaN(productStartDate.getTime())) {
                console.log('Invalid start date for product:', product);
                return false;
            }
    
            // Check if the product's startDate or endDate falls within the selected range
            const isInRange = productStartDate >= start && productStartDate <= end;
            return isInRange;
        });
    
        console.log('Filtered products:', filtered); // Debug log
        return filtered;
    };
    

    // Step 3: Generate PDF
    const generatePDF = () => {
        const doc = new jsPDF('l', 'pt', 'a4');
        const data = filterByDateRange();
        console.log('Data for PDF:', data); // Debug log

        if (data.length === 0) {
            console.log('No data available for the selected date range');
            alert('No data available for the selected date range');
            return;
        }

        // Define table headers
        const headers = [["Receipt No", "Customer Name", "Customer NIC", "Category", "Model", "Item", "Item No", "Size", "Market Price", "Estimate Price", "Total Interest", "Customer Paid", "Discount", "Profit"]];
        let totalEstimateValue = 0;
        let totalInterest = 0;
        let totalCustomerPaid = 0;
        let totalProfit = 0;
        // Define table rows
        const rows = data.map((product) => {
            const profit = product.customerPaid - product.estimateValue - product.discount;
    
            // Accumulate totals
            totalEstimateValue += product.estimateValue || 0;
            totalInterest += product.totalInterest || 0;
            totalCustomerPaid += product.customerPaid || 0;
            totalProfit += profit;
    
            return [
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
                product.totalInterest,
                product.customerPaid,
                product.discount,
                profit,
            ];
        });

        doc.setFontSize(8);

        // Add title
        doc.text('Pawn History Report', 20, 20);
        doc.text(`From: ${startDate} To: ${endDate}`, 20, 35);

        // Create PDF table with adjusted styles
        doc.autoTable({
            head: headers,
            body: rows,
            startY: 50,
            styles: { fontSize: 6, cellPadding: 2 },
            columnStyles: {
                0: { cellWidth: 40 },
                1: { cellWidth: 60 },
                2: { cellWidth: 50 },
                3: { cellWidth: 40 },
                4: { cellWidth: 40 },
                5: { cellWidth: 50 },
                6: { cellWidth: 40 },
                7: { cellWidth: 30 },
                8: { cellWidth: 40 },
                9: { cellWidth: 40 },
                10: { cellWidth: 40 },
                11: { cellWidth: 40 },
                12: { cellWidth: 40 },
                13: { cellWidth: 40 },
            },
            headStyles: { fillColor: [66, 135, 245], textColor: 255 },
            alternateRowStyles: { fillColor: [240, 240, 240] },
        });

        // Save the PDF
        doc.save(`Pawn_History_${startDate}_to_${endDate}.pdf`);
        setShowModal(false);
    };

    const calculateTotals = () => {
        let totalEstimatePrice = 0;
        let totalCustomerPaid = 0;
        let totalProfitLoss = 0;

        filteredProducts.forEach(product => {
            totalEstimatePrice += product.estimateValue || 0;
            totalCustomerPaid += product.customerPaid || 0;
            totalProfitLoss += (product.customerPaid - product.estimateValue - product.discount) || 0;
        });

        return {
            totalEstimatePrice,
            totalCustomerPaid,
            totalProfitLoss
        };
    };
    const totals = calculateTotals();
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
                                    {/* <th>ID</th> */}
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

                                    <th>Total Interest</th>
                                    <th>Customer Paid</th>
                                    <th>Discount</th>
                                    <th>Profit/Loss</th>



                                    <th>Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredProducts.map((product, index) => {
                                    const profit = product.customerPaid - product.estimateValue - product.discount;

                                    return (
                                        <tr key={product.id}>
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
                                            <td class="table-danger">{product.estimateValue}</td>

                                            <td>{product.totalInterest}</td>
                                            <td class="table-primary">{product.customerPaid}</td>
                                            <td>{product.discount}</td>

                                            
                                            <td class="table-info">{profit}</td>

                                            <td style={{ color: 'blue', fontWeight: 'bold' }}>
                                                {product.status}
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                            <tfoot>
                                <tr>
                                    <td colSpan="11" style={{ fontWeight: 'bold', textAlign: 'right' }}>Totals:</td>
                                    <td className="table-danger">{totals.totalEstimatePrice.toFixed(2)}</td>
                                    <td></td>
                                    <td className="table-primary">{totals.totalCustomerPaid.toFixed(2)}</td>
                                    <td></td>
                                    <td className="table-info">{totals.totalProfitLoss.toFixed(2)}</td>
                                    <td></td>
                                </tr>
                            </tfoot>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Pawn;
