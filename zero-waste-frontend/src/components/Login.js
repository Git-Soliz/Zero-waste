import { useState } from "react";
import axios from "axios";

export default function Login({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
  console.log("Sending login:", { email, password });
  try {
    const res = await axios.post("http://localhost:5000/auth/login", { email, password },
    {headers: { "Content-Type": "application/json" }});
    console.log("Login response:", res.data);
    alert("Logged in successfully!");
    if (onLogin) onLogin(res.data.token);
  } catch (err) {
    console.error("Login error:", err.response?.data || err);
    alert("Login error: " + (err.response?.data?.message || err.message));
  }
};


  return (
    <div>
      <h2>Login</h2>
      <input placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} />
      <input placeholder="Password" type="password" value={password} onChange={e => setPassword(e.target.value)} />
      <button onClick={handleLogin}>Login</button>
    </div>
  );
}
