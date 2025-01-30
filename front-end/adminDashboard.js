import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "./components/navbar";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import Button from "./components/button";
import { jwtDecode } from "jwt-decode";
import StatCard from "./components/dataCard";
import BarChart from "./components/BarChart";

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
  const [mostDistributedFuel, setMostDistributedFuel] = useState({
    fuelType: "",
    amount: 0,
  });
  const [distinctStations, setDistinctStations] = useState(0);
  const [mostActiveStation, setMostActiveStation] = useState({
    stationName: "",
    amount: 0,
  });
  const [stationsPumpedData, setStationsPumpedData] = useState([]);
  const [threeDaysPumpedData, setThreeDaysPumpedData] = useState({});
  const [sixMonthPumpedData, setSixMonthPumpedData] = useState({});

  // Check authentication and admin status on component mount
  useEffect(() => {
    const token = localStorage.getItem("adminToken");
    if (!token) {
      navigate("/admin-login");
      return;
    }

    try {
      const decodedToken = jwtDecode(token);
      // Check if token has admin username
      if (!decodedToken.sub) {
        console.error("Not authorized as admin");
        navigate("/admin-login");
      }
    } catch (error) {
      console.error("Token verification failed:", error);
      navigate("/admin-login");
    }
  }, [navigate]);
  
  // Add new useEffect for fetching distribution data
  useEffect(() => {
    const fetchDistributionData = async () => {
      try {
        const token = localStorage.getItem("adminToken");
        const response = await fetch(
          `${process.env.REACT_APP_API_URL}/api/distributions/total-fuel-last-three-days`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch distribution data");
        }

        const data = await response.json();
        setDistributionData(data);
      } catch (error) {
        console.error("Error fetching distribution data:", error);
      }
    };

    fetchDistributionData();
  }, []);

  // Add new useEffect for fetching 6-month data
  useEffect(() => {
    const fetchSixMonthData = async () => {
      try {
        const token = localStorage.getItem("adminToken");
        const response = await fetch(
          `${process.env.REACT_APP_API_URL}/api/distributions/total-fuel-last-six-months`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch 6-month data");
        }

        const data = await response.json();
        setSixMonthData(data);
      } catch (error) {
        console.error("Error fetching 6-month data:", error);
      }
    };

    fetchSixMonthData();
  }, []);
}