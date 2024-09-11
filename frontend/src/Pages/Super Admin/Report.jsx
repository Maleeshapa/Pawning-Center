import React, { useEffect, useState } from 'react';
import Sidebar from '../../components/Sidebar';
import axios from 'axios';
import jsPDF from 'jspdf';
import 'jspdf-autotable'; 
import './Report.css';

const Report = () => {
  const [items, setItems] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOrder, setSortOrder] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/items');
        setItems(response.data);
      } catch (error) {
        console.error('Error fetching items:', error);
      }
    };

    fetchItems();
  }, []);

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value.toLowerCase());
  };

  const handleSortById = () => {
    const sortedItems = [...items].sort((a, b) => {
      const idA = a.id;
      const idB = b.id;
      return sortOrder ? idA - idB : idB - idA;
    });
    setItems(sortedItems);
    setSortOrder(!sortOrder);
  };

  const filteredItems = items.filter((item) => {
    const lowerCaseQuery = searchQuery.toLowerCase();
    return (
      (item.customerName || '').toLowerCase().includes(lowerCaseQuery) ||
      (item.nic || '').toLowerCase().includes(lowerCaseQuery) ||
      (item.itemName || '').toLowerCase().includes(lowerCaseQuery)
    );
  });

  const handleDownloadReport = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/items/report', {
        params: {
          startDate,
          endDate,
        },
      });

      const itemsData = response.data;
      generatePDF(itemsData);

      setShowModal(false); 
    } catch (error) {
      console.error('Error fetching items for report:', error);
    }
  };

  const generatePDF = (data) => {
    const doc = new jsPDF();
    const tableColumn = ["ID", "Name", "NIC", "Item Name", "Start Date", "End Date", "Price Of Item", "Total Price", "Profit"];
    const tableRows = [];

    data.forEach(item => {
      const itemData = [
        item.id,
        item.customerName,
        item.nic,
        item.itemName,
        new Date(item.startDate).toLocaleDateString(),
        item.endDate ? new Date(item.endDate).toLocaleDateString() : 'N/A',
        item.priceOfItem,
        item.totalPrice,
        item.totalPrice - item.priceOfItem,
      ];
      tableRows.push(itemData);
    });

    
    doc.autoTable({
      head: [tableColumn],
      body: tableRows,
      foot: [
        [
          'Total',
          '',
          '',
          '',
          '',
          '',
          data.reduce((acc, item) => acc + item.priceOfItem, 0),
          data.reduce((acc, item) => acc + item.totalPrice, 0),
          data.reduce((acc, item) => acc + (item.totalPrice - item.priceOfItem), 0)
        ]
      ]
    });

  
    doc.save('report.pdf');
  };

  const handleCancel = () => {
    setShowModal(false); 
  };

  return (
    <div className="container-fluid">
      <div className="row flex-nowrap">
        <Sidebar />
        <div className="col py-3 content-area">
          <h1 className="text-center caption mb-4">Report</h1>

          <div className="d-flex flex-column flex-md-row justify-content-between align-items-center mb-4">
            <div className="input-group w-100 w-md-50 mb-3 mb-md-0">
              <input
                type="text"
                className="form-control"
                placeholder="Search by Name, NIC, or Item Name"
                value={searchQuery}
                onChange={handleSearchChange}
              />
            </div>

            <button
              className="btn btn-primary btn-sm me-2"
              onClick={() => { setShowModal(true); }}
            >
              Generate Report
            </button>
          </div>

          {showModal && (
            <div className="modal-container">
              <div className="modal-content">
                <h2 className="text-center mb-4">Generate Report</h2>
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
                <div className="d-flex justify-content-end">
                  <button
                    className="btn btn-secondary me-2"
                    onClick={handleCancel}
                  >
                    Cancel
                  </button>
                  <button
                    className="btn btn-primary"
                    onClick={handleDownloadReport}
                  >
                    Download
                  </button>
                </div>
              </div>
            </div>
          )}

          <div className="table-responsive">
            <table className="table table-striped table-hover">
              <thead>
                <tr>
                  <th onClick={handleSortById} style={{ cursor: 'pointer' }}>
                    ID {sortOrder ? '↑' : '↓'}
                  </th>
                  <th>Name</th>
                  <th>NIC</th>
                  <th>Start Date</th>
                  <th>End Date</th>
                  <th>Item Name</th>
                  <th>Price of Item</th>
                  <th>Interest %</th>
                  <th>Total Price</th>
                  <th>Status</th>
                  <th>Profit</th>
                </tr>
              </thead>
              <tbody>
                {filteredItems.map((item, index) => (
                  <tr key={item.id}>
                    <td>{item.id}</td>
                    <td>{item.customerName}</td>
                    <td>{item.nic}</td>
                    <td>{new Date(item.startDate).toLocaleDateString()}</td>
                    <td>{item.endDate ? new Date(item.endDate).toLocaleDateString() : 'N/A'}</td>
                    <td>{item.itemName}</td>
                    <td className="table-danger">{item.priceOfItem}</td>
                    <td>{item.interest}</td>
                    <td className="table-success">{item.totalPrice}</td>
                    <td
                      style={{
                        color: item.status === 'Payment Received' ? 'green' : 'red',
                        fontWeight: item.status === 'Payment Received' ? 'bold' : 'bold',
                      }}
                    >
                      {item.status || 'Pending'}
                    </td>
                    <td className="table-info">
                      {item.totalPrice - item.priceOfItem}
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

export default Report;
