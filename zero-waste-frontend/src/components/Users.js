import { useEffect, useState } from "react";
import axios from "axios";

export default function Users({ token }) {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await axios.get("http://localhost:5000/users", {
          headers: { Authorization: `Bearer ${token}` }
        });
        setUsers(res.data);
      } catch (err) {
        alert("Error fetching users: " + (err.response?.data?.message || err.message));
      }
    };
    if (token) fetchUsers();
  }, [token]);

  return (
    <div>
      <h2>Users</h2>
      <ul>
        {users.map(u => <li key={u.id}>{u.username} ({u.email})</li>)}
      </ul>
    </div>
  );
}
