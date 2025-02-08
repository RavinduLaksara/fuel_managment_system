import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import Navbar from "./components/navbar";
import Button from "./components/button";
import Table from "./components/table";

const StationTransac = () => {
  const navigate = useNavigate();
  const [transactions, setTransactions] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [sortConfig] = useState({
    key: "timestamp",
    direction: "desc",
  });
  const [filterFuelType, setFilterFuelType] = useState("all"); // New state for fuel type filter
  const [filterDateRange, setFilterDateRange] = useState("all");

  // Token validation
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

  // Fetch transactions
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

        if (!response.ok) throw new Error("Failed to fetch transactions");
        const data = await response.json();
        setTransactions(data);
      } catch (error) {
        console.error("Error:", error);
      }
    };

    fetchTransactions();
  }, []);

  // Helper function to check if date is within range
  const isDateInRange = (date) => {
    const today = new Date();
    const transactionDate = new Date(date);

    switch (filterDateRange) {
      case "today":
        return transactionDate.toDateString() === today.toDateString();
      case "week":
        const weekAgo = new Date(today.setDate(today.getDate() - 7));
        return transactionDate >= weekAgo;
      case "month":
        const monthAgo = new Date(today.setMonth(today.getMonth() - 1));
        return transactionDate >= monthAgo;
      default:
        return true;
    }
  };

  // Filter transactions
  const filteredTransactions = transactions.filter((transaction) => {
    const fuelTypeMatch =
      filterFuelType === "all"
        ? true
        : transaction.fuelType.toLowerCase() === filterFuelType.toLowerCase();
    const dateMatch = isDateInRange(transaction.timestamp);
    return fuelTypeMatch && dateMatch;
  });

  // Sort transactions
  const sortedTransactions = [...filteredTransactions].sort((a, b) => {
    if (sortConfig.key === "timestamp") {
      return sortConfig.direction === "asc"
        ? new Date(a.timestamp) - new Date(b.timestamp)
        : new Date(b.timestamp) - new Date(a.timestamp);
    }
    return sortConfig.direction === "asc"
      ? a[sortConfig.key] - b[sortConfig.key]
      : b[sortConfig.key] - a[sortConfig.key];
  });

  // Pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = sortedTransactions.slice(
    indexOfFirstItem,
    indexOfLastItem
  );
  const totalPages = Math.ceil(sortedTransactions.length / itemsPerPage);

  const navLinks = [
    { path: "/station-dashboard", label: "Dashboard" },
    { path: "/station-transac", label: "Transactions" },
    { path: "/station-req", label: "Request Fuel" },
    { path: "/station-employee-register", label: "Register Employee" },
  ];

  // Format data for Table component
  const columns = [
    "Transaction ID",
    "Employee",
    "Amount (L)",
    "Timestamp",
    "Fuel Type",
  ];
  const tableData = currentItems.map((transaction) => ({
    "Transaction ID": transaction.id,
    Employee: transaction.employee,
    "Amount (L)": (
      <span className="bg-blue-50 text-blue-600 px-3 py-1 rounded-full text-sm">
        {Number(transaction.pumpedAmount).toFixed(0)}L
      </span>
    ),
    Timestamp: new Date(transaction.timestamp),
    "Fuel Type": transaction.fuelType,
  }));

  return (
    <>
      <Navbar brand="Station" links={navLinks} />
      <div className="p-8 pt-12 bg-gray-50 min-h-[calc(100vh-64px)] mt-16">
        <div className="flex justify-between items-center mb-8 flex-wrap gap-4">
          <h1 className="text-2xl font-bold">Fuel Transactions</h1>
          <div className="flex gap-4 flex-wrap">
            <select
              value={filterFuelType}
              onChange={(e) => setFilterFuelType(e.target.value)}
              className="p-3 border border-gray-300 rounded-md min-w-[200px] bg-white text-base cursor-pointer focus:outline-none focus:border-blue-500"
            >
              <option value="all">All Fuel Types</option>
              <option value="petrol">Petrol</option>
              <option value="diesel">Diesel</option>
            </select>
            <select
              value={filterDateRange}
              onChange={(e) => setFilterDateRange(e.target.value)}
              className="p-3 border border-gray-300 rounded-md min-w-[200px] bg-white text-base cursor-pointer focus:outline-none focus:border-blue-500"
            >
              <option value="all">All Time</option>
              <option value="today">Today</option>
              <option value="week">This Week</option>
              <option value="month">This Month</option>
            </select>
          </div>
        </div>

        <Table columns={columns} data={tableData} />

        <div className="flex justify-center items-center gap-4 mt-8">
          <Button
            variant="outline"
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
          >
            Previous
          </Button>
          <span className="text-sm text-gray-600">
            Page {currentPage} of {totalPages}
          </span>
          <Button
            variant="outline"
            onClick={() =>
              setCurrentPage((prev) => Math.min(prev + 1, totalPages))
            }
            disabled={currentPage === totalPages}
          >
            Next
          </Button>
        </div>
      </div>
    </>
  );
};

export default StationTransac;
