import { useState } from "react";
import api from "../api";

export default function Login({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    if (!email || !password) {
      alert("Email and password are required");
      return;
    }

    try {
      console.log("Sending login:", { email, password });
      const res = await api.post("/users/login", { email, password });
      console.log("Login response:", res.data);

      alert("Logged in successfully!");
      if (onLogin) onLogin(res.data.token);
    } catch (err) {
      if (err.response) {
        console.error("Backend response error:", err.response.data);
        alert("Login error: " + (err.response.data.message || JSON.stringify(err.response.data)));
      } else if (err.request) {
        console.error("No response received:", err.request);
        alert("Login error: no response from server");
      } else {
        console.error("Error:", err.message);
        alert("Login error: " + err.message);
      }
    }
  };

  return (
    <div>
      <h2>Login</h2>
      <input
        placeholder="Email"
        value={email}
        onChange={e => setEmail(e.target.value)}
      />
      <input
        placeholder="Password"
        type="password"
        value={password}
        onChange={e => setPassword(e.target.value)}
      />
      <button onClick={handleLogin}>Login</button>
    </div>
  );
}
