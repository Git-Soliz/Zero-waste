import { useState } from "react";
import axios from "axios";

export default function Register({ onLogin }) {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleRegister = async () => {
    if (!username || !email || !password) {
      alert("All fields are required");
      return;
    }

    try {
      const res = await axios.post("http://localhost:5000/auth/register", { username, email, password });
      alert("Registered successfully!");
      if (onLogin) onLogin(res.data.token);
    } catch (err) {
      alert("Registration error: " + (err.response?.data?.message || err.message));
    }
  };

  return (
    <div>
      <h2>Register</h2>
      <input placeholder="Username" value={username} onChange={e => setUsername(e.target.value)} />
      <input placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} />
      <input placeholder="Password" type="password" value={password} onChange={e => setPassword(e.target.value)} />
      <button onClick={handleRegister}>Register</button>
    </div>
  );
}
