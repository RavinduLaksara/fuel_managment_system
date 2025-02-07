import React, { useState } from "react";
import Form from "./components/form";
import InputField from "./components/inputField";
import Button from "./components/button";
import ValidateMessage from "./components/validateMessage";
import { useNavigate } from "react-router-dom";
import { FaUserShield } from "react-icons/fa"; // Add this import at the top

const AdminLogin = () => {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
  const [message, setMessage] = useState({ text: "", type: "" });
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent the default form submission

    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/api/admins/login`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData), // Send the form data as JSON
        }
      );

      if (!response.ok) {
        throw new Error("Login failed");
      }

      const data = await response.json();
      console.log("Login successful:", data);

      // Store the token in localStorage
      localStorage.setItem("adminToken", data.token); // Store the received token
      console.log(data.token);
      setMessage({ text: "Login successful!", type: "success" });
      setTimeout(() => navigate("/admin-dashboard"), 1000);
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
        label="Username"
        type="text"
        placeholder="Enter admin username"
        value={formData.username}
        onChange={(e) =>
          handleChange({ target: { name: "username", value: e.target.value } })
        }
        required
      />
      <InputField
        label="Password"
        type="password"
        placeholder="Enter password"
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
      <Button
        type="submit"
        variant="primary"
        className="bg-indigo-900 hover:bg-indigo-800"
      >
        Login as Admin
      </Button>
      <Button
        type="button"
        variant="outline"
        onClick={() => setFormData({ username: "", password: "" })}
      >
        Clear
      </Button>
    </>
  );

  return (<>
   // stye
   </>
  );
};

export default AdminLogin;
