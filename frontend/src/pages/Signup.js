import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { signup } from "../api";

function Signup() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSignup = async () => {
    const data = await signup({ email, password });

    if (data.message) {
      alert(data.message);
      navigate("/");
    } else {
      alert(data.detail || data.error);
    }
  };

  return (
    <div className="container">
      <h2>Signup</h2>
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button onClick={handleSignup}>Signup</button>
      <p onClick={() => navigate("/")}>Already have an account? Login</p>
    </div>
  );
}

export default Signup;