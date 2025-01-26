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
    <div className="vehicle-register-container">
      <div className="header">
        <h1>Online Registration</h1>
      </div>
      <div className="content">
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

const styles = `
  .vehicle-register-container {
    min-height: 100vh;
  }

  .header {
    text-align: center;
    padding: 40px 0 20px;
  }

  .header h1 {
    color: #333;
    font-size: 2.5rem;
    margin: 0;
  }

  .content {
    padding-top: 20px;
  }
`;

// Add styles to document
const styleSheet = document.createElement("style");
styleSheet.textContent = styles;
document.head.appendChild(styleSheet);
export default VehicleRegister;
