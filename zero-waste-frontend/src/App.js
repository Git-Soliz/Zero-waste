import { useState } from "react";
import Register from "./components/Register";
import Login from "./components/Login";
import Users from "./components/Users";

function App() {
  const [token, setToken] = useState(null);

  return (
    <div>
      <h1>Zero Waste Mainai</h1>
      {!token && (
        <>
          <Register onLogin={setToken} />
          <Login onLogin={setToken} />
        </>
      )}
      {token && <Users token={token} />}
    </div>
  );
}

export default App;
