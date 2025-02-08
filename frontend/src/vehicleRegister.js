import React, { useState } from "react";
import Form from "./components/form";
import InputField from "./components/inputField";
import Button from "./components/button";
import ValidateMessage from "./components/validateMessage";

const VehicleRegister = () => {
  const [formData, setFormData] = useState({
    registrationNumber: "",
    engineNumber: "",
    model: "",
    ownerName: "",
    fuelType: "",
    phoneNumber: "", // Add phone number
  });
  const [message, setMessage] = useState({ text: "", type: "" });

  const handleChange = (field) => (event) => {
    setFormData({
      ...formData,
      [field]: event.target.value,
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/api/vehicles/register`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      setMessage({ text: "Vehicle registered successfully!", type: "success" });
      setFormData({
        registrationNumber: "",
        engineNumber: "",
        model: "",
        ownerName: "",
        fuelType: "",
        phoneNumber: "", // Add phone number
      });
    } catch (error) {
      console.error("Registration failed:", error);
      setMessage({
        text: "Failed to register vehicle. Please try again.",
        type: "error",
      });
    }
  };

  const formFields = [
    <ValidateMessage message={message.text} type={message.type} />,
    <InputField
      key="registrationNumber"
      label="Registration Number"
      value={formData.registrationNumber}
      onChange={handleChange("registrationNumber")}
      required
    />,
    <InputField
      key="engineNumber"
      label="Engine Number"
      value={formData.engineNumber}
      onChange={handleChange("engineNumber")}
      required
    />,
    <InputField
      key="model"
      label="Vehicle Model"
      value={formData.model}
      onChange={handleChange("model")}
      required
    />,
    <InputField
      key="ownerName"
      label="Owner's Name"
      value={formData.ownerName}
      onChange={handleChange("ownerName")}
      required
    />,
    <InputField
      key="phoneNumber"
      label="Phone Number"
      value={formData.phoneNumber}
      onChange={handleChange("phoneNumber")}
      required
    />,
    <select
      key="fuelType"
      className="w-full p-2 border rounded"
      value={formData.fuelType}
      onChange={handleChange("fuelType")}
      required
    >
      <option value="">Select Fuel Type</option>
      <option value="Petrol">Petrol</option>
      <option value="Diesel">Diesel</option>
    </select>,
  ];

  const formButtons = [
    <Button key="submit" type="submit" variant="primary">
      Register Vehicle
    </Button>,
    <Button
      key="reset"
      type="button"
      variant="outline"
      onClick={() =>
        setFormData({
          registrationNumber: "",
          engineNumber: "",
          model: "",
          ownerName: "",
          fuelType: "",
          phoneNumber: "", // Add phone number reset
        })
      }
    >
      Reset Form
    </Button>,
    <Button
      key="login"
      type="button"
      variant="primary"
      onClick={() => (window.location.href = "/vehicle-login")}
    >
      Login
    </Button>,
  ];

  return (
    <div className="min-h-screen bg-white-50 pb-8">
      <div className="text-center py-10 px-4">
        <h1 className="text-4xl font-bold text-gray-800">
          Online Registration
        </h1>
      </div>
      <div className="pt-5">
        <Form
          title="Vehicle Registration Form"
          description="Please fill out all required information to register your vehicle"
          fields={formFields}
          buttons={formButtons}
          onSubmit={handleSubmit}
          layout="grid"
        />
      </div>
    </div>
  );
};

export default VehicleRegister;
