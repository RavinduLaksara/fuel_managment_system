import React, { useState } from "react";
import Form from "./components/form";
import InputField from "./components/inputField";
import Button from "./components/button";
import ValidateMessage from "./components/validateMessage";

const StationRegister = () => {
  const [formData, setFormData] = useState({
    name: "",
    address: "",
    phoneNumber: "",
    password: "",
  });
  const [validation, setValidation] = useState({ message: "", type: "" });

  const handleChange = (field) => (event) => {
    setFormData({
      ...formData,
      [field]: event.target.value,
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setValidation({ message: "", type: "" });

    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/api/fuel-stations/register`,
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

      const data = await response.json();
      console.log("Registration successful:", data);
      setFormData({
        name: "",
        address: "",
        phoneNumber: "",
        password: "",
      });
      setValidation({
        message: "Station registered successfully!",
        type: "success",
      });
    } catch (error) {
      console.error("Registration failed:", error);
      setValidation({
        message: "Failed to register station. Please try again.",
        type: "error",
      });
    }
  };

  const formFields = [
    <ValidateMessage message={validation.message} type={validation.type} />,

    <InputField
      key="name"
      label="Station Name"
      value={formData.name}
      onChange={handleChange("name")}
      required
    />,
    <InputField
      key="address"
      label="Address"
      value={formData.address}
      onChange={handleChange("address")}
      required
    />,
    <InputField
      key="phoneNumber"
      label="Phone Number"
      value={formData.phoneNumber}
      onChange={handleChange("phoneNumber")}
      type="tel"
      required
    />,
    <InputField
      key="password"
      label="Password"
      value={formData.password}
      onChange={handleChange("password")}
      type="password"
      required
    />,
  ];

  const formButtons = [
    <Button key="submit" type="submit" variant="primary">
      Register Station
    </Button>,
    <Button
      key="reset"
      type="button"
      variant="outline"
      onClick={() =>
        setFormData({
          name: "",
          address: "",
          phoneNumber: "",
          password: "",
        })
      }
    >
      Reset Form
    </Button>,
  ];

  return (
    <div className="station-register-container">
      <div className="content">
        <Form
          title="Station Registration Form"
          description="Please fill out all required information to register your station"
          fields={formFields}
          buttons={formButtons}
          onSubmit={handleSubmit}
          layout="grid"
        />
      </div>
    </div>
  );
};

const styles = `
  .station-register-container {
    min-height: 100vh;
  }

  .content {
    padding-top: 80px;
  }
`;

const styleSheet = document.createElement("style");
styleSheet.textContent = styles;
document.head.appendChild(styleSheet);

export default StationRegister;
