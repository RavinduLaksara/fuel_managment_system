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
}