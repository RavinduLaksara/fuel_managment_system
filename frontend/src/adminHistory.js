import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "./components/navbar";
import Button from "./components/button";
import Table from "./components/table"; // Add this import

function AdminHistory() {
  const [distributions, setDistributions] = useState([]);
  const [filterFuelType, setFilterFuelType] = useState("all");
  const [filterDateRange, setFilterDateRange] = useState("all");
  const navigate = useNavigate();

  // Add pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    const token = localStorage.getItem("adminToken");
    if (!token) {
      navigate("/admin-login");
      return;
    }

    fetch(`${process.env.REACT_APP_API_URL}/api/distributions/all`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Unauthorized");
        }
        return response.json();
      })
      .then((data) => setDistributions(data))
      .catch((error) => {
        console.error("Error fetching distributions:", error);
        if (error.message === "Unauthorized") {
          navigate("/admin-login");
        }
      });
  }, [navigate]);

  // Add helper function for date filtering
  const isDateInRange = (date) => {
    const today = new Date();
    const distributionDate = new Date(date);

    switch (filterDateRange) {
      case "today":
        return distributionDate.toDateString() === today.toDateString();
      case "week":
        const weekAgo = new Date(today.setDate(today.getDate() - 7));
        return distributionDate >= weekAgo;
      case "month":
        const monthAgo = new Date(today.setMonth(today.getMonth() - 1));
        return distributionDate >= monthAgo;
      default:
        return true;
    }
  };

  // Filter distributions
  const filteredDistributions = distributions.filter((dist) => {
    const fuelTypeMatch =
      filterFuelType === "all"
        ? true
        : dist.fuelType.toLowerCase() === filterFuelType.toLowerCase();
    const dateMatch = isDateInRange(dist.timestamp);
    return fuelTypeMatch && dateMatch;
  });

  // Sort filtered distributions
  const sortedDistributions = [...filteredDistributions].sort(
    (a, b) => new Date(b.timestamp) - new Date(a.timestamp)
  );

  // Calculate current items and total pages
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = sortedDistributions.slice(
    indexOfFirstItem,
    indexOfLastItem
  );
  const totalPages = Math.ceil(sortedDistributions.length / itemsPerPage);

  const navLinks = [
    { path: "/admin-dashboard", label: "Dashboard" },
    { path: "/admin-stations", label: "Stations" },
    { path: "/admin-distributions", label: "Distributions" },
    { path: "/admin-req", label: "Requests" },
    { path: "/admin-history", label: "History" },
  ];

  // Add table columns configuration
  const columns = [
    "ID",
    "Fuel Amount",
    "Date & Time",
    "Station Name",
    "Fuel Type",
  ];

  // Format data for the Table component
  const tableData = currentItems.map((dist) => ({
    ID: dist.id,
    "Fuel Amount": <span className="amount-badge">{dist.fuelAmount}L</span>,
    "Date & Time": new Date(dist.timestamp).toLocaleString(),
    "Station Name": dist.fuelStation.name,
    "Fuel Type": dist.fuelType,
    "Transaction ID": dist.id, // needed for unique key in Table component
  }));

  return (
    <>
      <Navbar brand="Admin" links={navLinks} />
      <div className="p-8 bg-gray-50 min-h-screen mt-16">
        <h2 className="text-gray-800 mb-8 text-2xl font-semibold">
          Distribution History
        </h2>

        <div className="flex gap-4 mb-8 md:flex-row flex-col">
          <select
            value={filterFuelType}
            onChange={(e) => setFilterFuelType(e.target.value)}
            className="p-3 border border-gray-300 rounded-md min-w-[200px] bg-white text-base cursor-pointer focus:outline-none focus:border-blue-600"
          >
            <option value="all">All Fuel Types</option>
            <option value="petrol">Petrol</option>
            <option value="diesel">Diesel</option>
          </select>

          <select
            value={filterDateRange}
            onChange={(e) => setFilterDateRange(e.target.value)}
            className="p-3 border border-gray-300 rounded-md min-w-[200px] bg-white text-base cursor-pointer focus:outline-none focus:border-blue-600"
          >
            <option value="all">All Time</option>
            <option value="today">Today</option>
            <option value="week">This Week</option>
            <option value="month">This Month</option>
          </select>
        </div>

        <Table
          columns={columns}
          data={tableData.map((item) => ({
            ...item,
            "Fuel Amount": (
              <span className="bg-blue-50 text-blue-600 px-3 py-1 rounded-full text-sm font-medium">
                {item["Fuel Amount"]}
              </span>
            ),
          }))}
        />

        <div className="flex justify-center items-center gap-4 mt-8 md:flex-row flex-col">
          <Button
            variant="outline"
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="px-4 py-2 disabled:bg-gray-300 disabled:cursor-not-allowed"
          >
            Previous
          </Button>

          <span className="text-base text-gray-700">
            Page {currentPage} of {totalPages}
          </span>

          <Button
            variant="outline"
            onClick={() =>
              setCurrentPage((prev) => Math.min(prev + 1, totalPages))
            }
            disabled={currentPage === totalPages}
            className="px-4 py-2 disabled:bg-gray-300 disabled:cursor-not-allowed"
          >
            Next
          </Button>
        </div>
      </div>
    </>
  );
}

export default AdminHistory;
