import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import InputField from "./components/inputField";
import Button from "./components/button";
import { QRCodeSVG } from "qrcode.react";
import { jwtDecode } from "jwt-decode";
import BarChart from "./components/BarChart"; // Replace Bar import with BarChart

const VehicleDashboard = () => {
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [vehicleData, setVehicleData] = useState({
    id: "",
    engineNumber: "",
    model: "",
    ownerName: "",
    qrCode: "",
    weekQuota: "",
    registrationNumber: "",
  });
  const [pumpedData, setPumpedData] = useState({}); // Add state for pumped data

  useEffect(() => {
    const fetchVehicleData = async () => {
      try {
        const token = localStorage.getItem("vehicleToken");
        if (!token) {
          navigate("/vehicle-login");
          return;
        }
        console.log("Token:", token);
        const decodedToken = jwtDecode(token);
        const registrationNumber = decodedToken.sub;
        console.log("Registration Number:", registrationNumber);

        const response = await fetch(
          `${process.env.REACT_APP_API_URL}/api/vehicles/${registrationNumber}`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );
        console.log("Response:", response.status);

        if (!response.ok) {
          throw new Error("Failed to fetch vehicle data");
        }

        const data = await response.json();
        setVehicleData(data);
      } catch (error) {
        console.error("Error fetching vehicle data:", error);
        alert("Failed to load vehicle data");
      }
    };

    fetchVehicleData();
  }, [navigate]);

  useEffect(() => {
    const fetchPumpedData = async () => {
      const token = localStorage.getItem("vehicleToken");
      try {
        const id = vehicleData.id;
        console.log("Vehicle ID:", id);

        const response = await fetch(
          `${process.env.REACT_APP_API_URL}/api/transactions/total-pumped-last-seven-days/${id}`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        console.log("Pumped Data Response Status:", response.status);

        if (!response.ok) {
          throw new Error(`Error fetching pumped data: ${response.status}`);
        }

        const data = await response.json();
        console.log("Pumped Data:", data);

        // Ensure all past 7 days are present
        const today = new Date();
        const pastSevenDays = [];
        for (let i = 6; i >= 0; i--) {
          const date = new Date();
          date.setDate(today.getDate() - i);
          const formattedDate = date.toISOString().split("T")[0];
          pastSevenDays.push(formattedDate);
        }

        const completeData = {};
        pastSevenDays.forEach((date) => {
          completeData[date] = data[date] || 0;
        });

        setPumpedData(completeData);
      } catch (error) {
        console.error("Error fetching pumped data:", error);
        alert("Failed to load pumped data");
      }
    };

    if (vehicleData.id) {
      // Add condition to check if id exists
      fetchPumpedData();
    }
  }, [navigate, vehicleData.id]);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = () => {
    console.log("Saving vehicle data:", vehicleData);
    setIsEditing(false);
  };

  const handleChange = (name, value) => {
    setVehicleData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleLogout = () => {
    localStorage.removeItem("vehicleToken");
    navigate("/vehicle-login");
  };

  return (
    <div className="container mx-auto p-4 md:p-8 max-w-7xl">
      <div className="grid grid-cols-1 md:grid-cols-[1fr_auto_1fr] items-center gap-8 mb-8">
        <h1 className="text-3xl text-gray-800 font-semibold">
          Vehicle Dashboard
        </h1>

        <div className="flex flex-col items-center gap-2">
          <div className="w-[150px] h-[150px] border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center bg-gray-50">
            <QRCodeSVG
              value={vehicleData.qrCode || "No QR Code Available"}
              size={130}
              level="H"
              includeMargin={true}
            />
          </div>
          <p className="text-sm text-gray-600">Vehicle QR Code</p>
        </div>

        <div className="flex gap-4 justify-end items-center">
          <Button
            variant="outline"
            onClick={handleLogout}
            className="border-red-500 text-red-500 hover:bg-red-500 hover:text-white"
          >
            Logout
          </Button>
          {isEditing ? (
            <>
              <Button variant="primary" onClick={handleSave}>
                Save
              </Button>
              <Button variant="outline" onClick={() => setIsEditing(false)}>
                Cancel
              </Button>
            </>
          ) : (
            <Button variant="primary" onClick={handleEdit}>
              Edit Details
            </Button>
          )}
        </div>
      </div>

      <div className="flex flex-col gap-8">
        <div className="bg-white p-6 rounded-lg border border-gray-400">
          <h2 className="text-xl text-gray-700 font-medium mb-4">
            Vehicle Information
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <InputField
              label="Registration Number"
              value={vehicleData.registrationNumber}
              onChange={(e) =>
                handleChange("registrationNumber", e.target.value)
              }
              disabled={true}
            />
            <InputField
              label="Engine Number"
              value={vehicleData.engineNumber}
              onChange={(e) => handleChange("engineNumber", e.target.value)}
              disabled={!isEditing}
            />
            <InputField
              label="Model"
              value={vehicleData.model}
              onChange={(e) => handleChange("model", e.target.value)}
              disabled={!isEditing}
            />
            <InputField
              label="Owner Name"
              value={vehicleData.ownerName}
              onChange={(e) => handleChange("ownerName", e.target.value)}
              disabled={!isEditing}
            />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg  border border-gray-400">
          <h2 className="text-xl text-gray-700 font-medium mb-4">
            Fuel Information
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <InputField
              label="Weekly Quota"
              value={vehicleData.weekQuota}
              onChange={(e) => handleChange("weekQuota", e.target.value)}
              disabled={true}
            />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg  border border-gray-400">
          <h2 className="text-xl text-gray-700 font-medium mb-4">
            Total Pumped Last 7 Days
          </h2>
          <BarChart
            data={{
              labels: Object.keys(pumpedData),
              datasets: [
                {
                  label: "Total Pumped",
                  data: Object.values(pumpedData),
                  backgroundColor: "rgba(252, 211, 77)",
                },
              ],
            }}
            height="400px"
            valueFormatter={(value) => `${value.toLocaleString()}L`}
          />
        </div>
      </div>
    </div>
  );
};

export default VehicleDashboard;
