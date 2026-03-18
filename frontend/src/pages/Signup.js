import React from "react";
import { useNavigate } from "react-router-dom";
import "../index.css";

function Signup() {
  const navigate = useNavigate();

  return (
    <div className="container">
      <h2>Create Account 🚀</h2>

      <input type="text" placeholder="Enter Name" />
      <input type="email" placeholder="Enter Email" />
      <input type="password" placeholder="Enter Password" />

      <button>Signup</button>

      <p onClick={() => navigate("/")}>
        Already have account?{" "}
        <span style={{ color: "#00f2ff" }}>Login</span>
      </p>
    </div>
  );
}

export default Signup;