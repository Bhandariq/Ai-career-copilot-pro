import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "../api";

function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    const data = await login({ email, password });

    if (data.access_token) {
      localStorage.setItem("token", data.access_token);
      navigate("/dashboard");
    } else {
      alert(data.detail || data.error);
    }
  };

  return (
    <div className="container">
      <h2>Login</h2>
      <input
        className="inputTag"  
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input

        className="inputTag"
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button onClick={handleLogin}>Login</button>
      <p onClick={() => navigate("/signup")}>Don't have an account? <span>Signup</span></p>
    </div>
  );
}

export default Login;