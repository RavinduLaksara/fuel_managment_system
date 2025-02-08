import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { Pie } from "react-chartjs-2";
import Navbar from "./components/navbar";
import Table from "./components/table";
import StatCard from "./components/dataCard";

import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import Button from "./components/button";

// Register ChartJS components
ChartJS.register(ArcElement, Tooltip, Legend);

const StationDashboard = () => {
  const navigate = useNavigate();

  const [transactions, setTransactions] = useState([]);
  const [fuelTypeData, setFuelTypeData] = useState({});
  const [showAllTransactions, setShowAllTransactions] = useState(false);
  const [totalFuelReceived, setTotalFuelReceived] = useState(0);
  const [totalPumped, setTotalPumped] = useState(0);
  const [vehicleCount, setVehicleCount] = useState(0);
  const [mostPumpedFuel, setMostPumpedFuel] = useState({
    fuelType: "",
    pumpedAmount: 0,
  });

  // Add token validation
  useEffect(() => {
    const token = localStorage.getItem("stationToken");
    if (!token) {
      navigate("/station-login");
      return;
    }

    try {
      const decoded = jwtDecode(token);
      if (!decoded.sub) {
        navigate("/station-login");
      }
    } catch (error) {
      console.error("Invalid token:", error);
      navigate("/station-login");
    }
  }, [navigate]);

  // Add useEffect to fetch transactions
  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const token = localStorage.getItem("stationToken");
        const response = await fetch(
          `${process.env.REACT_APP_API_URL}/api/transactions/all`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch transactions");
        }

        const data = await response.json();
        setTransactions(data);
      } catch (error) {
        console.error("Error fetching transactions:", error);
      }
    };

    fetchTransactions();
  }, []);

  // Add useEffect to fetch fuel type data
  useEffect(() => {
    const fetchFuelTypeData = async () => {
      try {
        const token = localStorage.getItem("stationToken");
        const stationId = localStorage.getItem("stationId");
        //to be fixed
        const response = await fetch(
          `${process.env.REACT_APP_API_URL}/api/transactions/total-pumped-by-fuel-type/${stationId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch fuel type data");
        }

        const data = await response.json();
        setFuelTypeData(data);
      } catch (error) {
        console.error("Error fetching fuel type data:", error);
      }
    };

    fetchFuelTypeData();
  }, []);

  // Add new useEffect to fetch total fuel received
  useEffect(() => {
    const fetchTotalFuelReceived = async () => {
      try {
        const token = localStorage.getItem("stationToken");
        const stationId = localStorage.getItem("stationId");

        // Get stored station ID
        const response = await fetch(
          `${process.env.REACT_APP_API_URL}/api/distributions/total-distributed-today/${stationId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch total fuel received");
        }

        const data = await response.json();
        setTotalFuelReceived(data);
      } catch (error) {
        console.error("Error fetching total fuel received:", error);
      }
    };

    fetchTotalFuelReceived();
  }, []);

  // Add new useEffect to fetch total pumped
  useEffect(() => {
    const fetchTotalPumped = async () => {
      try {
        const token = localStorage.getItem("stationToken");
        const stationId = localStorage.getItem("stationId");
        const response = await fetch(
          `${process.env.REACT_APP_API_URL}/api/transactions/total-pumped-today/${stationId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch total pumped");
        }

        const data = await response.json();
        setTotalPumped(data);
      } catch (error) {
        console.error("Error fetching total pumped:", error);
      }
    };

    fetchTotalPumped();
  }, []);

  // Add useEffect to fetch vehicle count
  useEffect(() => {
    const fetchVehicleCount = async () => {
      try {
        const token = localStorage.getItem("stationToken");
        const response = await fetch(
          `${process.env.REACT_APP_API_URL}/api/transactions/count-vehicles-today`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch vehicle count");
        }

        const data = await response.json();
        setVehicleCount(data);
      } catch (error) {
        console.error("Error fetching vehicle count:", error);
      }
    };

    fetchVehicleCount();
  }, []);

  // Add useEffect to fetch most pumped fuel type
  useEffect(() => {
    const fetchMostPumpedFuel = async () => {
      try {
        const token = localStorage.getItem("stationToken");
        const response = await fetch(
          `${process.env.REACT_APP_API_URL}/api/transactions/most-pumped-fuel-type-today`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch most pumped fuel type");
        }

        const data = await response.json();
        setMostPumpedFuel(data);
      } catch (error) {
        console.error("Error fetching most pumped fuel type:", error);
      }
    };

    fetchMostPumpedFuel();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("stationToken");
    localStorage.removeItem("stationId");
    navigate("/station-login");
  };

  const navLinks = [
    { path: "/station-dashboard", label: "Dashboard" },
    { path: "/station-transac", label: "Transactions" },
    { path: "/station-req", label: "Request Fuel" },
    { path: "/station-employee-register", label: "Register Employee" },
  ];

  // Stats data
  const statsCards = [
    {
      title: "Total Vehicles Today",
      value: vehicleCount,
      change: "↑ Live",
      changeColor: "#4caf50",
      period: "Today",
    },
    {
      title: "Total Fuel Received Today",
      value: `${totalFuelReceived}L`,
      change: "↑ Updated just now",
      changeColor: "#4caf50",
      period: "Today",
    },
    {
      title: "Total Fuel Pumped Today",
      value: `${totalPumped}L`,
      change: "↑ Live",
      changeColor: "#4caf50",
      period: "Today",
    },
    {
      title: "Most Pumped Fuel Today",
      value: `${mostPumpedFuel.pumpedAmount}L`,
      change: `${mostPumpedFuel.fuelType}`,
      changeColor: "#4caf50",
      period: "Today",
    },
  ];

  // Customer satisfaction data

  // Transform fuel type data for pie chart
  const prepareFuelTypeData = () => {
    const labels = Object.keys(fuelTypeData);
    const values = Object.values(fuelTypeData);

    return {
      labels,
      datasets: [
        {
          data: values,
          backgroundColor: ["rgba(0, 122, 255, 0.8)", "rgba(88, 86, 214, 0.8)"],
          borderWidth: 2,
          borderColor: "#ffffff",
          borderRadius: 8, // Add rounded corners
          offset: 3, // Slight offset for better separation
        },
      ],
    };
  };

  // Sort transactions by timestamp in descending order
  const sortedTransactions = [...transactions].sort(
    (a, b) => new Date(b.timestamp) - new Date(a.timestamp)
  );

  // Add modal component for all transactions
  const TransactionsModal = () => (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
      onClick={() => setShowAllTransactions(false)}
    >
      <div
        className="bg-white rounded-lg w-11/12 max-w-6xl max-h-[90vh] overflow-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-xl">All Fuel Transactions</h2>
          <button
            className="text-2xl text-gray-600 hover:text-gray-800"
            onClick={() => setShowAllTransactions(false)}
          >
            ×
          </button>
        </div>
        <div className="p-6">
          <Table
            columns={[
              "Transaction ID",
              "Employee",
              "Pumped Amount (L)",
              "Timestamp",
            ]}
            data={sortedTransactions.map((transaction) => ({
              "Transaction ID": transaction.id,
              Employee: transaction.employee,
              "Pumped Amount (L)": `${transaction.pumpedAmount}L`,
              Timestamp: new Date(transaction.timestamp).toLocaleString(),
            }))}
          />
        </div>
      </div>
    </div>
  );

  return (
    <>
      <Navbar brand="Station" links={navLinks} />
      <div className="p-8 pt-12 bg-gray-50 min-h-[calc(100vh-64px)] mt-16">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl text-gray-800">Station Dashboard</h1>
          <div className="flex gap-4 items-center">
            <Button
              variant="outline"
              onClick={handleLogout}
              className="border-red-500 text-red-500 hover:bg-red-500 hover:text-white"
            >
              Logout
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
          {statsCards.map((stat, index) => (
            <StatCard key={index} {...stat} />
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-lg border border-gray-300 max-h-fit">
            <h3 className="mb-2">Fuel Distribution by Type</h3>
            <div className="h-[380px]">
              <Pie
                data={prepareFuelTypeData()}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: {
                      position: "bottom",
                      align: "center",
                      labels: {
                        usePointStyle: true,
                        padding: 24,
                        font: {
                          size: 13,
                          family:
                            '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
                          weight: "500",
                        },
                        boxWidth: 8,
                        boxHeight: 8,
                        color: "#1d1d1f",
                        generateLabels: (chart) => {
                          const data = chart.data;
                          if (data.labels.length && data.datasets.length) {
                            return data.labels.map((label, i) => ({
                              text: `${label}: ${data.datasets[0].data[
                                i
                              ].toLocaleString()}L`,
                              fillStyle: data.datasets[0].backgroundColor[i],
                              strokeStyle: "#ffffff",
                              pointStyle: "circle",
                              index: i,
                            }));
                          }
                          return [];
                        },
                      },
                    },
                    tooltip: {
                      backgroundColor: "rgba(255, 255, 255, 0.95)",
                      titleColor: "#1d1d1f",
                      titleFont: {
                        size: 14,
                        family:
                          '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
                        weight: "600",
                      },
                      bodyColor: "#1d1d1f",
                      bodyFont: {
                        size: 13,
                        family:
                          '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
                      },
                      padding: 12,
                      boxPadding: 6,
                      borderColor: "rgba(0,0,0,0.1)",
                      borderWidth: 1,
                      callbacks: {
                        label: (context) => {
                          const label = context.label || "";
                          const value = context.raw || 0;
                          return `${label}: ${value.toLocaleString()}L`;
                        },
                      },
                    },
                  },
                  layout: {
                    padding: {
                      top: 20,
                      bottom: 20,
                      left: 20,
                      right: 20,
                    },
                  },
                  elements: {
                    arc: {
                      borderWidth: 2,
                      borderColor: "#ffffff",
                      borderRadius: 8,
                      hoverOffset: 5,
                    },
                  },
                  radius: "90%", // Slightly smaller radius to accommodate spacing
                }}
              />
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg border border-gray-300">
            <h3 className="mb-2">Recent Fuel Transactions</h3>
            <Table
              columns={[
                "Transaction ID",
                "Employee",
                "Pumped Amount (L)",
                "Timestamp",
              ]}
              data={sortedTransactions.slice(0, 10).map((transaction) => ({
                "Transaction ID": transaction.id,
                Employee: transaction.employee,
                "Pumped Amount (L)": `${transaction.pumpedAmount}L`,
                Timestamp: new Date(transaction.timestamp).toLocaleString(),
              }))}
            />
            {transactions.length > 10 && (
              <div className="text-center mt-4">
                <Button
                  variant="outline"
                  onClick={() => navigate("/station-transac")}
                >
                  View All Transactions
                </Button>
              </div>
            )}
          </div>
        </div>

        {showAllTransactions && <TransactionsModal />}
      </div>
    </>
  );
};

export default StationDashboard;
