import { useState } from "react";
import Register from "./components/Register";
import Login from "./components/Login";
import Users from "./components/Users";

function App() {
  const [token, setToken] = useState(localStorage.getItem("token") || null);

  const handleLogin = (jwtToken) => {
    setToken(jwtToken);
    localStorage.setItem("token", jwtToken);
  };

  return (
    <div>
      {!token && (
        <>
          <Register onLogin={handleLogin} />
          <Login onLogin={handleLogin} />
        </>
      )}
      {token && <Users />}
    </div>
  );
}

export default App;
