import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from './components/navbar';
import Button from './components/button';

function AdminHistory() {
  const [distributions, setDistributions] = useState([]);
  const [filterFuelType, setFilterFuelType] = useState('all');
  const [filterDateRange, setFilterDateRange] = useState('all');
  const navigate = useNavigate();

  // Add pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (!token) {
      navigate('/admin-login');
      return;
    }

    fetch(`${process.env.REACT_APP_API_URL}/api/distributions/all`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
      .then(response => {
        if (!response.ok) {
          throw new Error('Unauthorized');
        }
        return response.json();
      })
      .then(data => setDistributions(data))
      .catch(error => {
        console.error('Error fetching distributions:', error);
        if (error.message === 'Unauthorized') {
          navigate('/admin-login');
        }
      });
  }, [navigate]);

  // Add helper function for date filtering
  const isDateInRange = (date) => {
    const today = new Date();
    const distributionDate = new Date(date);
    
    switch (filterDateRange) {
      case 'today':
        return distributionDate.toDateString() === today.toDateString();
      case 'week':
        const weekAgo = new Date(today.setDate(today.getDate() - 7));
        return distributionDate >= weekAgo;
      case 'month':
        const monthAgo = new Date(today.setMonth(today.getMonth() - 1));
        return distributionDate >= monthAgo;
      default:
        return true;
    }
  };

  // Filter distributions
  const filteredDistributions = distributions.filter(dist => {
    const fuelTypeMatch = filterFuelType === 'all' ? true : 
      dist.fuelType.toLowerCase() === filterFuelType.toLowerCase();
    const dateMatch = isDateInRange(dist.timestamp);
    return fuelTypeMatch && dateMatch;
  });

  // Sort filtered distributions
  const sortedDistributions = [...filteredDistributions].sort((a, b) => 
    new Date(b.timestamp) - new Date(a.timestamp)
  );

  // Calculate current items and total pages
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = sortedDistributions.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(sortedDistributions.length / itemsPerPage);

  const navLinks = [
    { path: '/admin-dashboard', label: 'Dashboard' },
    { path: '/admin-stations', label: 'Stations' },
    { path: '/admin-distributions', label: 'Distributions' },
    { path: '/admin-history', label: 'History' }
  ];

  return (
    <>
      <Navbar brand="Admin" links={navLinks} />
      <div className="admin-history-container" style={{ marginTop: '64px' }}>
        <h2>Distribution History</h2>
        <div className="filters">
          <select
            value={filterFuelType}
            onChange={(e) => setFilterFuelType(e.target.value)}
            className="filter-select"
          >
            <option value="all">All Fuel Types</option>
            <option value="petrol">Petrol</option>
            <option value="diesel">Diesel</option>
          </select>
          <select
            value={filterDateRange}
            onChange={(e) => setFilterDateRange(e.target.value)}
            className="filter-select"
          >
            <option value="all">All Time</option>
            <option value="today">Today</option>
            <option value="week">This Week</option>
            <option value="month">This Month</option>
          </select>
        </div>
        <div className="chart-card-table">
          <table className="queue-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Fuel Amount</th>
                <th>Date & Time</th>
                <th>Station Name</th>
                <th>Fuel Type</th>
              </tr>
            </thead>
            <tbody>
              {currentItems.map(dist => (
                <tr key={dist.id}>
                  <td>{dist.id}</td>
                  <td>
                    <span className="amount-badge">
                      {dist.fuelAmount}L
                    </span>
                  </td>
                  <td>{new Date(dist.timestamp).toLocaleString()}</td>
                  <td>{dist.fuelStation.name}</td>
                  <td>{dist.fuelType}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Replace pagination controls with reusable Button components */}
        <div className="pagination">
          <Button
            variant="outline"
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
          >
            Previous
          </Button>
          <span className="page-info">
            Page {currentPage} of {totalPages}
          </span>
          <Button
            variant="outline"
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
          >
            Next
          </Button>
        </div>
      </div>
    </>
  );
}

export default AdminHistory;
