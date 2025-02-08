import React, { useState, useEffect } from "react";
import Table from "./components/table";
import Button from "./components/button";
import Navbar from "./components/navbar";
import StatCard from "./components/dataCard";

const AdminStaReq = () => {
  const [requests, setRequests] = useState([]);

  const navLinks = [
    { path: "/admin-dashboard", label: "Dashboard" },
    { path: "/admin-stations", label: "Stations" },
    { path: "/admin-distributions", label: "Distributions" },
    { path: "/admin-req", label: "Requests" },
    { path: "/admin-history", label: "History" },
  ];

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/api/requests/all`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
          },
        }
      );
      const data = await response.json();
      console.log("Raw API response:", data); // Debug the exact API response
      setRequests(data);
    } catch (error) {
      console.error("Error fetching requests:", error);
    }
  };

  const handleStatusChange = async (request, status) => {
    try {
      await fetch(
        `${process.env.REACT_APP_API_URL}/api/requests/${request.id}/status`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
          },
          body: JSON.stringify({ status: status }),
        }
      );

      if (status === 1) {
        // Create distribution with correct format
        await fetch(
          `${process.env.REACT_APP_API_URL}/api/distributions/create`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
            },
            body: JSON.stringify({
              fuelAmount: Number(request.amount),
              timestamp: new Date().toISOString(),
              fuelStation: {
                id: Number(request.fuelStation.id),
              },
              fuelType: request.fuelType,
            }),
          }
        );
      }

      fetchRequests();
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  const pendingColumns = [
    "Station ID",
    "Fuel Type",
    "Amount",
    "Status",
    "Actions",
  ];
  const approvedColumns = ["Station ID", "Fuel Type", "Amount", "Status"];

  const formatTableData = (requests, includingActions = false) => {
    console.log("Formatting requests:", requests); // Debug input
    return requests.map((request) => {
      // Log individual request to see its structure
      console.log("Individual request:", request);

      const rowData = {
        "Station ID":
          request.id_station || request.station_id || request.id || "N/A",
        "Fuel Type": request.fuelType,
        Amount: `${request.amount}L`,
        Status: getStatusText(request.status),
        "Transaction ID": request.id,
      };

      if (includingActions) {
        rowData.Actions = (
          <div className="flex gap-2">
            <Button
              onClick={() => handleStatusChange(request, 1)}
              variant="primary"
              className="w-24"
            >
              Approve
            </Button>
            <Button
              onClick={() => handleStatusChange(request, 2)}
              variant="secondary"
              className="w-24"
            >
              Reject
            </Button>
          </div>
        );
      }

      return rowData;
    });
  };

  const getStatusText = (status) => {
    switch (Number(status)) {
      case 0:
        return "Pending";
      case 1:
        return "Approved";
      case 2:
        return "Rejected";
      default:
        return "Unknown";
    }
  };

  const pendingRequests = requests.filter((req) => Number(req.status) === 0);
  const approvedRejectedRequests = requests.filter(
    (req) => Number(req.status) > 0
  );

  return (
    <>
      <Navbar brand="Admin" links={navLinks} />
      <div className="p-8 pt-20 bg-gray-50 min-h-screen">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8 mt-6">
          <StatCard
            title="Total Requests"
            value={requests.length}
            change="All time"
            period="Total requests in system"
          />
          <StatCard
            title="Pending Requests"
            value={pendingRequests.length}
            change="Awaiting approval"
            period="Need immediate action"
          />
          <StatCard
            title="Approved Requests"
            value={
              approvedRejectedRequests.filter((req) => Number(req.status) === 1)
                .length
            }
            change="Successfully processed"
            period="All time approved"
          />
          <StatCard
            title="Rejected Requests"
            value={
              approvedRejectedRequests.filter((req) => Number(req.status) === 2)
                .length
            }
            change="Denied requests"
            period="All time rejected"
          />
        </div>

        <h2 className="text-2xl font-bold mb-6">Pending Requests</h2>
        <Table
          columns={pendingColumns}
          data={formatTableData(pendingRequests, true)}
        />

        <h2 className="text-2xl font-bold mb-6 mt-12">Processed Requests</h2>
        <Table
          columns={approvedColumns}
          data={formatTableData(approvedRejectedRequests)}
        />
      </div>
    </>
  );
};

export default AdminStaReq;
