import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from './components/navbar';
import { Line, Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import Button from './components/button';
import { jwtDecode } from 'jwt-decode';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const AdminDashboard = () => {
  const navigate = useNavigate();
  
  const [distributionData, setDistributionData] = useState({});
  const [sixMonthData, setSixMonthData] = useState({});
  const [todayTotal, setTodayTotal] = useState(0);
  const [mostDistributedFuel, setMostDistributedFuel] = useState({ fuelType: '', amount: 0 });
  const [distinctStations, setDistinctStations] = useState(0);
  const [mostActiveStation, setMostActiveStation] = useState({ stationName: '', amount: 0 });
  const [stationsPumpedData, setStationsPumpedData] = useState([]);
  const [threeDaysPumpedData, setThreeDaysPumpedData] = useState({});
  const [sixMonthPumpedData, setSixMonthPumpedData] = useState({});

  // Check authentication and admin status on component mount
  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (!token) {
      navigate('/admin-login');
      return;
    }

    try {
      const decodedToken = jwtDecode(token);
      // Check if token has admin username
      if (!decodedToken.sub) {
        console.error('Not authorized as admin');
        navigate('/admin-login');
      }
    } catch (error) {
      console.error('Token verification failed:', error);
      navigate('/admin-login');
    }
  }, [navigate]);

  // Add new useEffect for fetching distribution data
  useEffect(() => {
    const fetchDistributionData = async () => {
      try {
        const token = localStorage.getItem('adminToken');
        const response = await fetch(`${process.env.REACT_APP_API_URL}/api/distributions/total-fuel-last-three-days`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (!response.ok) {
          throw new Error('Failed to fetch distribution data');
        }

        const data = await response.json();
        setDistributionData(data);
      } catch (error) {
        console.error('Error fetching distribution data:', error);
      }
    };

    fetchDistributionData();
  }, []);

  // Add new useEffect for fetching 6-month data
  useEffect(() => {
    const fetchSixMonthData = async () => {
      try {
        const token = localStorage.getItem('adminToken');
        const response = await fetch(`${process.env.REACT_APP_API_URL}/api/distributions/total-fuel-last-six-months`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (!response.ok) {
          throw new Error('Failed to fetch 6-month data');
        }

        const data = await response.json();
        setSixMonthData(data);
      } catch (error) {
        console.error('Error fetching 6-month data:', error);
      }
    };

    fetchSixMonthData();
  }, []);

  // Add new useEffect for fetching today's total
  useEffect(() => {
    const fetchTodayTotal = async () => {
      try {
        const token = localStorage.getItem('adminToken');
        const response = await fetch(`${process.env.REACT_APP_API_URL}/api/distributions/total-distributed-today`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (!response.ok) {
          throw new Error('Failed to fetch today\'s total');
        }

        const data = await response.json();
        setTodayTotal(data);
      } catch (error) {
        console.error('Error fetching today\'s total:', error);
      }
    };

    fetchTodayTotal();
  }, []);

  // Add new useEffect for fetching most distributed fuel type
  useEffect(() => {
    const fetchMostDistributedFuel = async () => {
      try {
        const token = localStorage.getItem('adminToken');
        const response = await fetch(`${process.env.REACT_APP_API_URL}/api/distributions/most-distributed-fuel-type-today`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (!response.ok) {
          throw new Error('Failed to fetch most distributed fuel type');
        }

        const data = await response.json();
        setMostDistributedFuel(data);
      } catch (error) {
        console.error('Error fetching most distributed fuel type:', error);
      }
    };

    fetchMostDistributedFuel();
  }, []);

  // Add new useEffect for fetching distinct stations
  useEffect(() => {
    const fetchDistinctStations = async () => {
      try {
        const token = localStorage.getItem('adminToken');
        const response = await fetch(`${process.env.REACT_APP_API_URL}/api/distributions/distinct-fuel-stations-today`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (!response.ok) {
          throw new Error('Failed to fetch distinct stations');
        }

        const data = await response.json();
        setDistinctStations(data);
      } catch (error) {
        console.error('Error fetching distinct stations:', error);
      }
    };

    fetchDistinctStations();
  }, []);

  // Add new useEffect for fetching most active station
  useEffect(() => {
    const fetchMostActiveStation = async () => {
      try {
        const token = localStorage.getItem('adminToken');
        const response = await fetch(`${process.env.REACT_APP_API_URL}/api/distributions/most-distributed-station-today`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (!response.ok) {
          throw new Error('Failed to fetch most active station');
        }

        const data = await response.json();
        setMostActiveStation(data);
      } catch (error) {
        console.error('Error fetching most active station:', error);
      }
    };

    fetchMostActiveStation();
  }, []);

  useEffect(() => {
    const fetchStationsPumpedData = async () => {
      try {
        const token = localStorage.getItem('adminToken');
        const response = await fetch(`${process.env.REACT_APP_API_URL}/api/fuel-stations/total-pumped-today`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (!response.ok) {
          throw new Error('Failed to fetch stations pumped data');
        }

        const data = await response.json();
        setStationsPumpedData(data);
      } catch (error) {
        console.error('Error fetching stations pumped data:', error);
      }
    };

    fetchStationsPumpedData();
  }, []);

  // Add new useEffect for fetching 3-day pumped data
  useEffect(() => {
    const fetchThreeDaysPumpedData = async () => {
      try {
        const token = localStorage.getItem('adminToken');
        const response = await fetch(`${process.env.REACT_APP_API_URL}/api/transactions/total-pumped-last-three-days`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (!response.ok) {
          throw new Error('Failed to fetch 3-day pumped data');
        }

        const data = await response.json();
        setThreeDaysPumpedData(data);
      } catch (error) {
        console.error('Error fetching 3-day pumped data:', error);
      }
    };

    fetchThreeDaysPumpedData();
  }, []);

  // Add new useEffect for fetching 6-month pumped data
  useEffect(() => {
    const fetchSixMonthPumpedData = async () => {
      try {
        const token = localStorage.getItem('adminToken');
        const response = await fetch(`${process.env.REACT_APP_API_URL}/api/transactions/total-pumped-last-six-months`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (!response.ok) {
          throw new Error('Failed to fetch 6-month pumped data');
        }

        const data = await response.json();
        setSixMonthPumpedData(data);
      } catch (error) {
        console.error('Error fetching 6-month pumped data:', error);
      }
    };

    fetchSixMonthPumpedData();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    navigate('/admin-login');
  };

  // Updated stats cards for fuel management
  const statsCards = [
    {
      title: 'Today\'s Fuel Distribution',
      value: `${todayTotal}L`,
      change: '-',
      period: 'Today\'s total'
    },
    {
      title: 'Most Distributed Fuel Today',
      value: `${mostDistributedFuel.amount}L`,
      change: mostDistributedFuel.fuelType,
      period: 'Fuel type'
    },
    {
      title: 'Active Fuel Stations Today',
      value: distinctStations,
      change: 'Distinct stations',
      period: 'Today\'s count'
    },
    {
      title: 'Most Active Station Today',
      value: `${mostActiveStation.amount}L`,
      change: mostActiveStation.stationName,
      period: 'Station name'
    }
  ];

  // Transform the date-based data into arrays for the chart
  const prepareFuelDistributionData = () => {
    const dates = Object.keys(distributionData).sort();
    const values = dates.map(date => distributionData[date]);
    const pumpedValues = dates.map(date => threeDaysPumpedData[date] || 0);
    
    return {
      labels: dates.map(date => new Date(date).toLocaleDateString()),
      datasets: [
        {
          label: 'Distributed Fuel (L)',
          data: values,
          backgroundColor: '#4285f4'
        },
        {
          label: 'Pumped Fuel (L)',
          data: pumpedValues,
          backgroundColor: '#34a853'
        }
      ]
    };
  };

  // Updated chart data using real data
  const fuelDistributionData = prepareFuelDistributionData();

  // Transform 6-month data for the line chart
  const prepareSixMonthData = () => {
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const sortedData = Object.entries(sixMonthData)
      .sort(([dateA], [dateB]) => {
        const [yearA, monthA] = dateA.split('-');
        const [yearB, monthB] = dateB.split('-');
        return new Date(yearA, monthA - 1) - new Date(yearB, monthB - 1);
      });

    const labels = sortedData.map(([date]) => {
      const [year, month] = date.split('-');
      return `${monthNames[parseInt(month) - 1]} ${year}`;
    });

    const values = sortedData.map(([, value]) => value);

    return {
      labels,
      datasets: [
        {
          label: 'Distributed Fuel (L)',
          data: values,
          borderColor: '#4285f4',
          tension: 0.4
        },
        {
          label: 'Pumped Fuel (L)',
          data: labels.map(label => {
            const [month, year] = label.split(' ');
            const monthNum = monthNames.indexOf(month) + 1;
            const key = `${year}-${monthNum}`;
            return sixMonthPumpedData[key] || 0;
          }),
          borderColor: '#34a853',
          tension: 0.4
        }
      ]
    };
  };

  // Use real data for the line chart
  const fuelTrendsData = prepareSixMonthData();

  // Prepare data for horizontal bar chart
  const prepareStationsPumpedData = () => {
    const labels = stationsPumpedData.map(item => item.fuelStationName);
    const values = stationsPumpedData.map(item => item.totalPumped);
    return {
      labels,
      datasets: [{
        label: 'Today\'s Pumped (L)',
        data: values,
        backgroundColor: '#4285f4',
        borderWidth: 1
      }]
    };
  };

  const navLinks = [
    { path: '/admin-dashboard', label: 'Dashboard' },
    { path: '/admin-stations', label: 'Stations' },
    { path: '/admin-distributions', label: 'Distributions' },
    { path: '/admin-history', label: 'History' }
  ];

  return (
    <>
      <Navbar 
        brand="Admin"
        links={navLinks}
      />
      <div className="admin-dashboard">
        <div className="dashboard-header">
          <h1>Business Dashboard</h1>
          <div className="dashboard-filters">
            
            
            <Button 
              variant="outline" 
              onClick={handleLogout}
              className="logout-button"
            >
              Logout
            </Button>
          </div>
        </div>

        <div className="stats-grid">
          {statsCards.map((stat, index) => (
            <div key={index} className="stat-card">
              <h3>{stat.title}</h3>
              <div className="stat-value">{stat.value}</div>
              <div className="stat-change">
                <span className="change-value">{stat.change}</span>
                <span className="change-period">{stat.period}</span>
              </div>
            </div>
          ))}
        </div>

        <div className="charts-grid">
          <div className="chart-card">
            <h3>Fuel Distribution Last 3 Days</h3>
            <Bar 
              data={fuelDistributionData}
              options={{
                responsive: true,
                scales: {
                  y: {
                    beginAtZero: true,
                    title: {
                      display: true,
                      text: 'Liters (L)'
                    },
                    ticks: {
                      callback: value => value.toLocaleString() + 'L'
                    }
                  }
                },
                plugins: {
                  legend: {
                    position: 'top',
                  },
                  tooltip: {
                    callbacks: {
                      label: function(context) {
                        return `${context.dataset.label}: ${context.raw.toLocaleString()}L`;
                      }
                    }
                  }
                }
              }}
            />
          </div>
          <div className="chart-card">
            <h3>Fuel Distribution Trends (6 Months)</h3>
            <Line 
              data={fuelTrendsData}
              options={{
                responsive: true,
                scales: {
                  y: {
                    beginAtZero: true,
                    title: {
                      display: true,
                      text: 'Liters (L)'
                    },
                    ticks: {
                      callback: value => value.toLocaleString() + 'L'
                    }
                  }
                },
                plugins: {
                  legend: {
                    position: 'top',
                  },
                  tooltip: {
                    callbacks: {
                      label: function(context) {
                        return `${context.dataset.label}: ${context.raw.toLocaleString()}L`;
                      }
                    }
                  }
                }
              }}
            />
          </div>
        </div>

        <div className="chart-card horizontal-chart">
          <h3>Today's Pumped Amount by Each Fuel Station</h3>
          <Bar 
            data={prepareStationsPumpedData()}
            options={{
              indexAxis: 'y',
              responsive: true,
              maintainAspectRatio: false,
              scales: {
                x: {
                  beginAtZero: true,
                  title: {
                    display: true,
                    text: 'Liters (L)'
                  },
                  ticks: {
                    callback: value => value.toLocaleString() + 'L'
                  }
                }
              },
              plugins: {
                legend: {
                  display: false
                },
                tooltip: {
                  callbacks: {
                    label: function(context) {
                      return `${context.raw.toLocaleString()}L`;
                    }
                  }
                }
              }
            }}
          />
        </div>
      </div>
    </>
  );
};