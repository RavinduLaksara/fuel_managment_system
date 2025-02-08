import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import Navbar from "./components/navbar";
import Form from "./components/form";
import InputField from "./components/inputField";
import Button from "./components/button";
import ValidateMessage from "./components/validateMessage";
import Table from "./components/table";

const StationReq = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    amount: "",
    fuelType: "Petrol",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [requests, setRequests] = useState([]);

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

  // Add new useEffect for fetching requests
  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const token = localStorage.getItem("stationToken");
        const stationId = localStorage.getItem("stationId");
        const response = await fetch(
          `${process.env.REACT_APP_API_URL}/api/requests/all/${stationId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) throw new Error("Failed to fetch requests");
        const data = await response.json();
        setRequests(data);
      } catch (error) {
        console.error("Error:", error);
      }
    };

    fetchRequests();
  }, [success]); // Refresh when new request is submitted

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const token = localStorage.getItem("stationToken");
      const stationId = localStorage.getItem("stationId");

      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/api/requests`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            fuelStation: {
              id: parseInt(stationId),
            },
            amount: parseFloat(formData.amount),
            fuelType: formData.fuelType,
            status: "0",
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to submit request");
      }

      setSuccess("Fuel request submitted successfully!");
      setFormData({
        amount: "",
        fuelType: "Petrol",
      });
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const navLinks = [
    { path: "/station-dashboard", label: "Dashboard" },
    { path: "/station-transac", label: "Transactions" },
    { path: "/station-req", label: "Request Fuel" },
    { path: "/station-employee-register", label: "Register Employee" },
  ];

  // Format data for Table component
  const columns = ["Request ID", "Amount (L)", "Fuel Type", "Status"];
  const tableData = requests.map((request) => ({
    "Request ID": request.id,
    "Amount (L)": (
      <span className="bg-blue-50 text-blue-600 px-3 py-1 rounded-full text-sm">
        {Number(request.amount).toFixed(0)}L
      </span>
    ),
    "Fuel Type": request.fuelType,
    //set it to rejected if status is 2 and approved if status is 1 else pending
    Status:
      request.status === 2
        ? "Rejected"
        : request.status === 1
        ? "Approved"
        : "Pending",
  }));

  return (
    <>
      <Navbar brand="Station" links={navLinks} />
      <div className="p-8 pt-24 bg-gray-50 min-h-screen ">
        <Form
          title="Request Fuel"
          description="Submit a new fuel request for your station"
          onSubmit={handleSubmit}
          fields={
            <>
              {error && <ValidateMessage message={error} type="error" />}
              {success && <ValidateMessage message={success} type="success" />}
              <InputField
                label="Fuel Amount (L)"
                name="amount"
                type="number"
                value={formData.amount}
                onChange={handleInputChange}
                placeholder="Enter amount in liters"
                required
              />
              <InputField
                label="Fuel Type"
                name="fuelType"
                type="select"
                value={formData.fuelType}
                onChange={handleInputChange}
                required
              >
                <option value="Petrol">Petrol</option>
                <option value="Diesel">Diesel</option>
              </InputField>
            </>
          }
          buttons={
            <>
              <Button type="submit" disabled={loading}>
                {loading ? "Submitting..." : "Submit Request"}
              </Button>
            </>
          }
        />

        <div className="mt-8">
          <h2 className="text-xl font-bold mb-4">Your Requests</h2>
          <Table columns={columns} data={tableData} />
        </div>
      </div>
    </>
  );
};

export default StationReq;
