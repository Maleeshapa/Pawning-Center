import React, { useState, useEffect } from 'react';
import moment from 'moment-timezone';
import config from '../../config';

const DashboardTotals = () => {
  const [totals, setTotals] = useState({
    totalEstimate: 0,
    totalPaid: 0
  });

  useEffect(() => {
    const fetchTodayTotals = async () => {
      try {
        const response = await fetch(`${config.BASE_URL}/api/products`);
        const data = await response.json();
        
        // Filter for today's data only
        const today = moment().format('YYYY-MM-DD');
        const todayData = data.filter(item => 
          moment(item.dateTime).format('YYYY-MM-DD') === today
        );

        // Calculate totals
        const totalEstimate = todayData.reduce((sum, item) => sum + (parseFloat(item.estimateValue) || 0), 0);
        const totalPaid = todayData.reduce((sum, item) => sum + (parseFloat(item.customerPaid) || 0), 0);

        setTotals({
          totalEstimate,
          totalPaid
        });
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchTodayTotals();
  }, []);

  return (
    <div className="mb-4">
      <div className="card">
        <div className="card-body">
          <h5 className="card-title mb-3">Today's Totals</h5>
          <div className="row">
            <div className="col-12">
              <div className="d-flex justify-content-between align-items-center mb-2">
                <span className="text-muted">Pawning Advance:</span>
                <span className="fw-bold">
                  Rs. {totals.totalEstimate.toLocaleString()}
                </span>
              </div>
              <div className="d-flex justify-content-between align-items-center">
                <span className="text-muted">Customer Paid:</span>
                <span className="fw-bold">
                  Rs. {totals.totalPaid.toLocaleString()}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardTotals;