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
 // style
    </>
  );
}

export default AdminHistory;
