import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaGasPump } from "react-icons/fa";
import Form from "./components/form";
import InputField from "./components/inputField";
import Button from "./components/button";
import ValidateMessage from "./components/validateMessage";

const StationLogin = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    password: "",
  });
  const [validation, setValidation] = useState({
    message: "",
    type: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setValidation({ message: "", type: "" });

    if (!formData.name || !formData.password) {
      setValidation({
        message: "Please fill in all fields",
        type: "error",
      });
      return;
    }

    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/api/fuel-stations/login`,
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
      if (data.status !== 1) {
        setValidation({
          message:
            "Your station has not been approved yet. Please wait for admin approval.",
          type: "warning",
        });
        return;
      }

      setValidation({
        message: "Login successful! Redirecting...",
        type: "success",
      });

      localStorage.setItem("stationToken", data.token);
      localStorage.setItem("stationId", data.stationId);
      setTimeout(() => navigate("/station-dashboard"), 1500);
    } catch (error) {
      console.error("Login error:", error);
      setValidation({
        message: "Login failed. Please check your credentials.",
        type: "error",
      });
    }
  };

  const fields = (
    <>
      <ValidateMessage message={validation.message} type={validation.type} />
      <InputField
        label="Station Name"
        type="text"
        placeholder="Enter Station Name"
        value={formData.name}
        onChange={(e) =>
          handleChange({ target: { name: "name", value: e.target.value } })
        }
        required
      />
      <InputField
        label="Password"
        type="password"
        placeholder="Enter Password"
        value={formData.password}
        onChange={(e) =>
          handleChange({ target: { name: "password", value: e.target.value } })
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
        onClick={() => setFormData({ name: "", password: "" })}
      >
        Clear
      </Button>
    </>
  );

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white p-5">
      <div className="text-center mb-8">
        <FaGasPump size={50} className="text-blue-600 mx-auto" />
        <h1 className="mt-4 text-3xl text-gray-800 font-semibold">
          Fuel Station Portal
        </h1>
      </div>
      <Form
        title="Station Login"
        description="Please enter your station credentials to continue"
        fields={fields}
        buttons={buttons}
        onSubmit={handleSubmit}
        layout="stack"
      />
    </div>
  );
};

export default StationLogin;
