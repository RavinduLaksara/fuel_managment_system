import React, { useState } from "react";
import Form from "./components/form";
import InputField from "./components/inputField";
import Button from "./components/button";
import Navbar from "./components/navbar"; // Add this import
import ValidateMessage from "./components/validateMessage";

const StationEmployeeRegistration = () => {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
  const [message, setMessage] = useState({ text: "", type: "" });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); // Add this line to prevent default form submission
    try {
      const token = localStorage.getItem("stationToken");
      const stationId = localStorage.getItem("stationId");

      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/api/fuel-stations/employees/register`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            username: formData.username,
            password: formData.password,
            fuelStation: {
              id: parseInt(stationId),
            },
          }),
        }
      );

      if (response.ok) {
        setMessage({
          text: "Employee registered successfully!",
          type: "success",
        });
        setFormData({ username: "", password: "" });
      } else {
        throw new Error("Registration failed");
      }
    } catch (error) {
      setMessage({
        text: "Registration failed: " + error.message,
        type: "error",
      });
    }
  };

  const navLinks = [
    { path: "/station-dashboard", label: "Dashboard" },
    { path: "/station-transac", label: "Transactions" },
    { path: "/station-req", label: "Request Fuel" },
    { path: "/station-employee-register", label: "Register Employee" },
  ];

  const formFields = (
    <>
      <ValidateMessage message={message.text} type={message.type} />
      <InputField
        label="Username"
        type="text"
        name="username"
        value={formData.username}
        onChange={handleChange}
        required
      />
      <InputField
        label="Password"
        type="password"
        name="password"
        value={formData.password}
        onChange={handleChange}
        required
      />
    </>
  );

  const formButtons = (
    <Button type="submit" variant="primary">
      Register Employee
    </Button>
  );

  return (
    <>
      <Navbar brand="Staton" links={navLinks} />
      <div className="mt-12 pt-14 px-10">
        <Form
          title="Station Employee Registration"
          description="Register a new employee for the fuel station"
          fields={formFields}
          buttons={formButtons}
          onSubmit={handleSubmit}
          layout="stack"
        />
      </div>
    </>
  );
};

export default StationEmployeeRegistration;
