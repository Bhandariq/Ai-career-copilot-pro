import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../index.css";

function Signup() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSignup = async () => {
    if (!email || !password) {
      alert("Fill all fields");
      return;
    }

    try {
      const res = await fetch("http://localhost:8000/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (res.ok) {
        alert("Signup successful");
        navigate("/");
      } else {
        alert(data.detail);
      }
    } catch (err) {
      alert("Server error");
    }
  };

  return (
    <div className="container">
      <h2>Create Account 🚀</h2>

      <input
        type="email"
        placeholder="Enter Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <input
        type="password"
        placeholder="Enter Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <button onClick={handleSignup}>Signup</button>

      <p onClick={() => navigate("/")}>
        Already have account?{" "}
        <span style={{ color: "#00f2ff" }}>Login</span>
      </p>
    </div>
  );
}

export default Signup;