import React, { useEffect, useState } from 'react';
import Sidebar from '../../components/Sidebar';
import axios from 'axios';
import './Products.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import config from '../../config';

const Pawn = () => {
    const [products, setProducts] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await axios.get(`${config.BASE_URL}/api/products`);
                const soldProducts = response.data.filter(product => product.status === 'Release' || product.status === 'Pawned');
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
    
        const formatDateTime = (dateString) => {
            const date = new Date(dateString);
            
            // Format the date to YYYY/MM/DD
            const formattedDate = `${date.getFullYear()}/${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getDate().toString().padStart(2, '0')}`;
            
            // Format the time to HH:mm AM/PM
            const hours = date.getHours();
            const minutes = date.getMinutes().toString().padStart(2, '0');
            const ampm = hours >= 12 ? 'PM' : 'AM';
            const formattedTime = `${hours % 12 || 12}.${minutes} ${ampm}`;
        
            return `${formattedDate}, ${formattedTime}`;
        };

        
       
        
    
        // Define table headers
        const headers = [["Receipt No", "Customer Name", "Customer NIC", "Category", "Model", "Item", "Item No", "Size", "Start Date", "End Date", "Estimated Value", "Pawning Advance", "Customer Paid", "Discount", "Profit"]]; // Removed Total Interest
        let totalEstimateValue = 0;
        let totalCustomerPaid = 0;
        let totalProfit = 0;
    
        // Define table rows
        const rows = data.map((product) => {
            const profit = product.customerPaid - product.estimateValue - product.discount;
    
            // Accumulate totals
            totalEstimateValue += product.estimateValue || 0;
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
                formatDateTime(product.startDate),
                product.endDate ? formatDateTime(product.endDate) : 'N/A',
                product.marketValue,
                product.estimateValue,
                product.customerPaid,
                product.discount,
                profit,
            ];
        });
    
        doc.setFontSize(8);
    
        // Add title
        doc.text('Pawn History Report', 20, 20);
        doc.text(`From: ${formatDateTime(startDate)} To: ${formatDateTime(endDate)}`, 20, 35);
    
        // Create PDF table with adjusted styles
        doc.autoTable({
            head: headers,
            body: rows,
            startY: 50,
            styles: { fontSize: 6, cellPadding: 2 },
            columnStyles: {
                0: { cellWidth: 30 },
                1: { cellWidth: 70 },
                2: { cellWidth: 50 },
                3: { cellWidth: 50 },
                4: { cellWidth: 50 },
                5: { cellWidth: 60 },
                6: { cellWidth: 50 },
                7: { cellWidth: 40 },
                8: { cellWidth: 50 },
                9: { cellWidth: 50 },
                10: { cellWidth: 50 },
                11: { cellWidth: 50 },
                12: { cellWidth: 50 },
                13: { cellWidth: 50 },
                14: { cellWidth: 50 },
            },
            headStyles: { fillColor: [66, 135, 245], textColor: 255 },
            alternateRowStyles: { fillColor: [240, 240, 240] },
        });
        // Add this code after the autoTable for the main table
        doc.autoTable({
            body: [
                [
                    'Totals:', 
                    '', 
                    '', 
                    '', 
                    '', 
                    '', 
                    '', 
                    '', 
                    '', 
                    '',
                    '',
                    
                    totalEstimateValue.toFixed(2),  // Estimated Value
                    totalCustomerPaid.toFixed(2),    // Pawning Advance
                    totals.totaldiscount.toFixed(2),  // Customer Paid
                                                  // Blank for Discount
                    totalProfit.toFixed(2)            // Profit
                ]
            ],
            startY: doc.autoTable.previous.finalY + 10, // Position it after the table
            styles: { fontSize: 6, cellPadding: 2 }, // Adjusted styles
            columnStyles: {
                0: { cellWidth: 30 },
                1: { cellWidth: 70 },
                2: { cellWidth: 50 },
                3: { cellWidth: 50 },
                4: { cellWidth: 50 },
                5: { cellWidth: 60 },
                6: { cellWidth: 50 },
                7: { cellWidth: 40 },
                8: { cellWidth: 50 },
                9: { cellWidth: 50 },  // End Date
                10: { fontStyle: 'bold', cellWidth: 50 }, // Estimated Value total
                11: { fontStyle: 'bold', cellWidth: 50 }, // Pawning Advance total
                12: { fontStyle: 'bold', cellWidth: 50 }, // Customer Paid total
                14: { fontStyle: 'bold', cellWidth: 50 }, // Profit total
            }
        });

    
        // Save the PDF
        doc.save(`Pawn_History_${formatDateTime(startDate).replace(/[/:]/g, '-')}_to_${formatDateTime(endDate).replace(/[/:]/g, '-')}.pdf`);
        setShowModal(false);
    };
    

    const calculateTotals = () => {
        let totalEstimatePrice = 0;
        let totalCustomerPaid = 0;
        let totalProfitLoss = 0;
        let totaldiscount = 0;

        filteredProducts.forEach(product => {
            totalEstimatePrice += product.estimateValue || 0;
            totalCustomerPaid += product.customerPaid || 0;
            totaldiscount += product.discount || 0;
            
            // Calculate profit/loss based on status
            if (product.status === 'Release') {
                totalProfitLoss += (product.customerPaid - product.discount - product.estimateValue) || 0;
            } else if (product.status === 'Pawned') {
                totalProfitLoss += product.customerPaid || 0;
            }
        });

        return {
            totalEstimatePrice,
            totalCustomerPaid,
            totalProfitLoss,
            totaldiscount
        };
    };

    const totals = calculateTotals();

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return `${date.getFullYear()}/${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getDate().toString().padStart(2, '0')}`;
    };

    return (
        <div className="container-fluid">
            <div className="row flex-nowrap">
                <Sidebar />
                <div className="col py-3 content-area">
                    <h1 className="text-center caption mb-4">උකස් ඉතිහාසය</h1>

                    <div className="d-flex flex-column flex-md-row justify-content-between align-items-center mb-4">
                        <div className="input-group w-100 w-md-50 mb-3 mb-md-0">
                            <input type="text" className="form-control" placeholder="Search by Name, NIC, or Item Name"
                                value={searchQuery} onChange={handleSearchChange} />
                        </div>
                        <button
                            className="btn btn-primary btn-sm me-2"
                            onClick={() => { setShowModal(true); }}
                        >
                            උකස් අදායම් වර්තාව
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

                                    <th>Estimated Value</th>
                                    <th>Pawning Advance</th>

                                    {/* <th>Total Interest</th> */}
                                    <th>Customer Paid</th>
                                    <th>Discount</th>
                                    <th>Profit</th>



                                    <th>Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredProducts.map((product) => {
                                    const interest = product.status === 'Release' 
                                        ? product.customerPaid - product.discount - product.estimateValue
                                        : product.customerPaid;

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
                                            <td>{formatDate(product.startDate)}</td>
                                            <td>{product.endDate ? formatDate(product.endDate) : 'N/A'}</td>
                                            <td>{product.marketValue}</td>
                                            <td className="table-danger">{product.estimateValue}</td>
                                            <td className="table-primary">{product.customerPaid}</td>
                                            <td>{product.discount}</td>
                                            <td className="table-info">{interest}</td>
                                            <td
                                                style={{
                                                    color: product.status === 'Release' ? 'green' : product.status === 'Pawned' ? 'red' : 'blue',
                                                    fontWeight: 'bold'
                                                }}
                                            >
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
                                    <td className="table-primary">{totals.totalCustomerPaid.toFixed(2)}</td>
                                    <td className="table-primary">{totals.totaldiscount.toFixed(2)}</td>
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
