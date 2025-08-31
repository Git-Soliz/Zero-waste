import { useState } from "react";
import api from "../api"; // api turi būti axios instance su baseURL

export default function Register({ onLogin }) {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleRegister = async () => {
    // ✅ frontend validacija
    if (!username || !email || !password) {
      alert("All fields are required");
      return;
    }

    try {
      console.log("Sending registration:", { username, email, password });

      // POST į backend, siunčiame JSON
      const res = await api.post("/users/register", { username, email, password });

      console.log("Register response:", res.data);
      alert("Registered successfully!");

      // jei yra onLogin funkcija, perduodam token
      if (onLogin) onLogin(res.data.token);
    } catch (err) {
      // Tikslūs backend klaidų pranešimai
      if (err.response && err.response.data) {
        console.error("Backend response error:", err.response.data);
        alert("Registration error: " + (err.response.data.message || JSON.stringify(err.response.data)));
      } else {
        console.error("Error:", err.message);
        alert("Registration error: " + err.message);
      }
    }
  };

  return (
    <div>
      <h2>Register</h2>
      <input
        placeholder="Username"
        value={username}
        onChange={e => setUsername(e.target.value)}
      />
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
      <button onClick={handleRegister}>Register</button>
    </div>
  );
}
