import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "./components/navbar";
import Form from "./components/form";
import InputField from "./components/inputField";
import Button from "./components/button";
import ValidateMessage from "./components/validateMessage";

const AdminDistributions = () => {
  const navigate = useNavigate();
  const [stations, setStations] = useState([]);
  const [validationMessage, setValidationMessage] = useState({
    text: "",
    type: "",
  });
  const [distribution, setDistribution] = useState({
    fuelAmount: "",
    timestamp: new Date().toISOString().slice(0, 16), // Format: YYYY-MM-DDTHH:mm
    fuelStation: { id: "" },
    fuelType: "",
  });

  const adminNavLinks = [
    { path: "/admin-dashboard", label: "Dashboard" },
    { path: "/admin-stations", label: "Stations" },
    { path: "/admin-distributions", label: "Distributions" },
    { path: "/admin-req", label: "Requests" },
    { path: "/admin-history", label: "History" },
  ];

  useEffect(() => {
    const fetchStations = async () => {
      try {
        const token = localStorage.getItem("adminToken");
        if (!token) {
          navigate("/admin-login");
          return;
        }

        const response = await fetch(
          `${process.env.REACT_APP_API_URL}/api/fuel-stations/all-with-status`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (response.status === 401) {
          navigate("/admin-login");
          return;
        }
        if (!response.ok) throw new Error("Failed to fetch stations");
        const data = await response.json();
        setStations(data.filter((station) => station.status === 1));
      } catch (error) {
        console.error("Error fetching stations:", error);
        setValidationMessage({
          text: "Failed to fetch stations",
          type: "error",
        });
      }
    };
    fetchStations();
  }, [navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "stationId") {
      setDistribution({
        ...distribution,
        fuelStation: { id: value },
      });
    } else if (name === "fuelAmount") {
      const numValue = value === "" ? "" : Math.max(0, Number(value));
      setDistribution({
        ...distribution,
        [name]: numValue,
      });
    } else if (name === "timestamp") {
      // Handle timestamp without timezone conversion
      setDistribution({
        ...distribution,
        timestamp: value,
      });
    } else {
      setDistribution({
        ...distribution,
        [name]: value,
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("adminToken");
      if (!token) {
        navigate("/admin-login");
        return;
      }

      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/api/distributions/create`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(distribution),
        }
      );

      if (response.status === 401) {
        navigate("/admin-login");
        return;
      }
      if (!response.ok) {
        throw new Error("Failed to create distribution");
      }

      setValidationMessage({
        text: "Distribution created successfully!",
        type: "success",
      });
      setTimeout(() => navigate("/admin-distributions"), 2000);
    } catch (error) {
      console.error("Error creating distribution:", error);
      setValidationMessage({
        text: "Failed to create distribution",
        type: "error",
      });
    }
  };

  const formFields = (
    <>
      <InputField
        label="Fuel Amount"
        type="number"
        name="fuelAmount"
        value={distribution.fuelAmount}
        onChange={handleChange}
        required={true}
        placeholder="Enter fuel amount"
        className="w-full"
      />
      <InputField
        label="Timestamp"
        type="datetime-local"
        name="timestamp"
        value={distribution.timestamp}
        onChange={handleChange}
        required={true}
        className="w-full"
      />
      <InputField
        label="Station Name"
        type="select"
        name="stationId"
        value={distribution.fuelStation.id}
        onChange={handleChange}
        required={true}
        className="w-full"
      >
        <option value="">Select Station</option>
        {stations.map((station) => (
          <option key={station.id} value={station.id}>
            {station.name}
          </option>
        ))}
      </InputField>
      <InputField
        label="Fuel Type"
        type="select"
        name="fuelType"
        value={distribution.fuelType}
        onChange={handleChange}
        required={true}
        className="w-full"
      >
        <option value="">Select Fuel Type</option>
        <option value="Petrol">Petrol</option>
        <option value="Diesel">Diesel</option>
      </InputField>
    </>
  );

  const formButtons = (
    <Button type="submit" variant="primary">
      Create Distribution
    </Button>
  );

  return (
    <>
      <Navbar brand="Admin" links={adminNavLinks} />

      <div className="pt-40 pb-10 ">
        <Form
          title="Create New Distribution"
          description="Enter the details to create a new fuel distribution"
          fields={
            <>
              {validationMessage.text && (
                <ValidateMessage
                  message={validationMessage.text}
                  type={validationMessage.type}
                />
              )}
              {formFields}
            </>
          }
          buttons={formButtons}
          onSubmit={handleSubmit}
          layout="stack"
        />
      </div>
    </>
  );
};

export default AdminDistributions;
