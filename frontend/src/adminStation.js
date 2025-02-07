import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import Button from "./components/button";
import Navbar from "./components/navbar";
import Table from "./components/table";
import StatCard from "./components/dataCard";

const AdminStations = () => {
  const navigate = useNavigate();
  const [stations, setStations] = useState([]);
  const [stats, setStats] = useState({
    totalStations: 0,
    pendingStations: 0,
    approvedStations: 0,
  });

  const adminNavLinks = [
    { path: "/admin-dashboard", label: "Dashboard" },
    { path: "/admin-stations", label: "Stations" },
    { path: "/admin-distributions", label: "Distributions" },
    { path: "/admin-req", label: "Requests" },
    { path: "/admin-history", label: "History" },
  ];

  // Check authentication
  useEffect(() => {
    const token = localStorage.getItem("adminToken");
    if (!token) {
      navigate("/admin-login");
      return;
    }

    try {
      const decodedToken = jwtDecode(token);
      if (!decodedToken.sub) {
        navigate("/admin-login");
      }
    } catch (error) {
      console.error("Token verification failed:", error);
      navigate("/admin-login");
    }
  }, [navigate]);

  // Fetch stations data
  useEffect(() => {
    const fetchStations = async () => {
      try {
        const token = localStorage.getItem("adminToken");
        const response = await fetch(
          `${process.env.REACT_APP_API_URL}/api/fuel-stations/all-with-status`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch stations");
        }

        const data = await response.json();
        setStations(data);
      } catch (error) {
        console.error("Error fetching stations:", error);
      }
    };

    fetchStations();
  }, []);

  // Add new useEffect for fetching stats
  useEffect(() => {
    const calculateStats = () => {
      const pending = stations.filter((station) => station.status === 0).length;
      const approved = stations.filter(
        (station) => station.status === 1
      ).length;
      setStats({
        totalStations: stations.length,
        pendingStations: pending,
        approvedStations: approved,
      });
    };

    calculateStats();
  }, [stations]);

  const handleApprove = async (stationId) => {
    try {
      const token = localStorage.getItem("adminToken");
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/api/fuel-stations/${stationId}/activate`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to approve station");
      }

      // Refresh stations list
      window.location.reload();
    } catch (error) {
      console.error("Error approving station:", error);
    }
  };

  const handleReject = async (stationId) => {
    try {
      const token = localStorage.getItem("adminToken");
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/api/fuel-stations/${stationId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to reject station");
      }

      // Refresh stations list
      window.location.reload();
    } catch (error) {
      console.error("Error rejecting station:", error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    navigate("/admin-login");
  };

  const pendingStations = stations.filter((station) => station.status === 0);
  const approvedStations = stations.filter((station) => station.status === 1);

  return (
    <>
      // style
    </>
  );
};

export default AdminStations;
