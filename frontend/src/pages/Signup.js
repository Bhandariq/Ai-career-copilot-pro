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
    <div>
      <h2>Signup</h2>
      <input onChange={(e) => setEmail(e.target.value)} />
      <input onChange={(e) => setPassword(e.target.value)} />
      <button onClick={handleSignup}>Signup</button>
    </div>
  );
}

export default Signup;