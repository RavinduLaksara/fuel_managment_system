import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaCar } from "react-icons/fa";
import Form from "./components/form";
import InputField from "./components/inputField";
import Button from "./components/button";
import ValidateMessage from "./components/validateMessage";

const VehicleLogin = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    registrationNumber: "",
    engineNumber: "",
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
    e.preventDefault();
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/api/vehicles/login`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );
      if (!response.ok) {
        throw new Error("Login failed");
      }

      const data = await response.json();
      // Save token to localStorage
      localStorage.setItem("vehicleToken", data.token);
      setMessage({ text: "Login successful!", type: "success" });
      setTimeout(() => navigate("/vehicle-dashboard"), 1000);
    } catch (error) {
      console.error("Login error:", error);
      setMessage({
        text: "Login failed. Please check your credentials.",
        type: "error",
      });
    }
  };

  const fields = (
    <>
      <ValidateMessage message={message.text} type={message.type} />
      <InputField
        label="Registration Number"
        type="text"
        placeholder="Enter Registration Number"
        value={formData.registrationNumber}
        onChange={(e) =>
          handleChange({
            target: { name: "registrationNumber", value: e.target.value },
          })
        }
        required
      />
      <InputField
        label="Engine Number"
        type="password"
        placeholder="Enter Engine Number"
        value={formData.engineNumber}
        onChange={(e) =>
          handleChange({
            target: { name: "engineNumber", value: e.target.value },
          })
        }
        required
      />
    </>
  );

  const buttons = (
    <>
      <Button type="submit" variant="primary">
        Login
      </Button>
      <Button
        type="button"
        variant="outline"
        onClick={() =>
          setFormData({ registrationNumber: "", engineNumber: "" })
        }
      >
        Clear
      </Button>
    </>
  );

  return (
    <div className="vehicle-login-container">
      <div className="vehicle-login-header">
        <FaCar className="vehicle-icon" />
        <h1>Please login to continue</h1>
      </div>
      <Form
        title="Vehicle Login"
        description="Please enter your vehicle credentials to continue"
        fields={fields}
        buttons={buttons}
        onSubmit={handleSubmit}
        layout="stack"
      />
    </div>
  );
};

// Add styles specific to vehicle login
const styles = `
  .vehicle-login-container {
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    background-color: white;
    padding: 20px;
  }

  .vehicle-login-header {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 10px;
    margin-bottom: 30px;
  }

  .vehicle-icon {
    font-size: 3.5rem;
    color: #4a90e2;
  }

  .vehicle-login-header h1 {
    font-size: 2rem;
    color: #333;
    margin: 0;
  }
`;

// Add styles to document
const styleSheet = document.createElement("style");
styleSheet.textContent = styles;
document.head.appendChild(styleSheet);

export default VehicleLogin;
