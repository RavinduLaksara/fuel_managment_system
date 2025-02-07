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

  // Add new useEffect for fetching today's total
  useEffect(() => {
    const fetchTodayTotal = async () => {
      try {
        const token = localStorage.getItem("adminToken");
        const response = await fetch(
          `${process.env.REACT_APP_API_URL}/api/distributions/total-distributed-today`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch today's total");
        }

        const data = await response.json();
        setTodayTotal(data);
      } catch (error) {
        console.error("Error fetching today's total:", error);
      }
    };

    fetchTodayTotal();
  }, []);

  // Add new useEffect for fetching most distributed fuel type
  useEffect(() => {
    const fetchMostDistributedFuel = async () => {
      try {
        const token = localStorage.getItem("adminToken");
        const response = await fetch(
          `${process.env.REACT_APP_API_URL}/api/distributions/most-distributed-fuel-type-today`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch most distributed fuel type");
        }

        const data = await response.json();
        setMostDistributedFuel(data);
      } catch (error) {
        console.error("Error fetching most distributed fuel type:", error);
      }
    };

    fetchMostDistributedFuel();
  }, []);

// Add new useEffect for fetching distinct stations
useEffect(() => {
  const fetchDistinctStations = async () => {
    try {
      const token = localStorage.getItem("adminToken");
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/api/distributions/distinct-fuel-stations-today`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch distinct stations");
      }

      const data = await response.json();
      setDistinctStations(data);
    } catch (error) {
      console.error("Error fetching distinct stations:", error);
    }
  };

  fetchDistinctStations();
}, []);

// Add new useEffect for fetching most active station
useEffect(() => {
  const fetchMostActiveStation = async () => {
    try {
      const token = localStorage.getItem("adminToken");
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/api/distributions/most-distributed-station-today`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch most active station");
      }

      const data = await response.json();
      setMostActiveStation(data);
    } catch (error) {
      console.error("Error fetching most active station:", error);
    }
  };

  fetchMostActiveStation();
}, []);

useEffect(() => {
  const fetchStationsPumpedData = async () => {
    try {
      const token = localStorage.getItem("adminToken");
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/api/fuel-stations/total-pumped-today`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch stations pumped data");
      }

      const data = await response.json();
      setStationsPumpedData(data);
    } catch (error) {
      console.error("Error fetching stations pumped data:", error);
    }
  };

  fetchStationsPumpedData();
}, []);

// Add new useEffect for fetching 3-day pumped data
useEffect(() => {
  const fetchThreeDaysPumpedData = async () => {
    try {
      const token = localStorage.getItem("adminToken");
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/api/transactions/total-pumped-last-three-days`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch 3-day pumped data");
      }

      const data = await response.json();
      setThreeDaysPumpedData(data);
    } catch (error) {
      console.error("Error fetching 3-day pumped data:", error);
    }
  };

  fetchThreeDaysPumpedData();
}, []);

// Add new useEffect for fetching 6-month pumped data
useEffect(() => {
  const fetchSixMonthPumpedData = async () => {
    try {
      const token = localStorage.getItem("adminToken");
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/api/transactions/total-pumped-last-six-months`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch 6-month pumped data");
      }

      const data = await response.json();
      setSixMonthPumpedData(data);
    } catch (error) {
      console.error("Error fetching 6-month pumped data:", error);
    }
  };

  fetchSixMonthPumpedData();
}, []);

const handleLogout = () => {
  localStorage.removeItem("adminToken");
  navigate("/admin-login");
};

// Updated stats cards for fuel management
const statsCards = [
  {
    title: "Today's Fuel Distribution",
    value: `${todayTotal}L`,
    change: "-",
    period: "Today's total",
  },
  {
    title: "Most Distributed Fuel Today",
    value: `${mostDistributedFuel.amount}L`,
    change: mostDistributedFuel.fuelType,
    period: "Fuel type",
  },
  {
    title: "Active Fuel Stations Today",
    value: distinctStations,
    change: "Distinct stations",
    period: "Today's count",
  },
  {
    title: "Most Active Station Today",
    value: `${mostActiveStation.amount}L`,
    change: mostActiveStation.stationName,
    period: "Station name",
  },
];

// Transform the date-based data into arrays for the chart
const prepareFuelDistributionData = () => {
  const dates = Object.keys(distributionData).sort();
  const last3Dates = dates.slice(-3);
  const values = last3Dates.map((date) => distributionData[date]);
  const pumpedValues = last3Dates.map(
    (date) => threeDaysPumpedData[date] || 0
  );

  return {
    labels: last3Dates.map((date) => new Date(date).toLocaleDateString()),
    datasets: [
      {
        label: "Distributed Fuel (L)",
        data: values,
        backgroundColor: "#4285f4",
      },
      {
        label: "Pumped Fuel (L)",
        data: pumpedValues,
        backgroundColor: "#34a853",
      },
    ],
  };
};

}