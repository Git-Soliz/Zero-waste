import express from "express";
import cors from "cors";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const app = express();
app.use(cors());
app.use(express.json());
app.use("/auth", authRoutes);

const users = []; // atmintyje laikomi vartotojai
const JWT_SECRET = "supersecret"; // realiame projekte naudok .env

// Register
app.post("/register", async (req, res) => {
  const { username, email, password } = req.body;
  if (!username || !email || !password)
    return res.status(400).json({ message: "All fields are required" });

  if (users.find(u => u.email === email || u.username === username))
    return res.status(400).json({ message: "User already exists" });

  const hashed = await bcrypt.hash(password, 10);
  const newUser = { id: users.length + 1, username, email, password: hashed };
  users.push(newUser);

  const token = jwt.sign({ id: newUser.id, username: newUser.username }, JWT_SECRET, { expiresIn: "1h" });
  res.status(201).json({ id: newUser.id, username, email, token });
});

// Login
app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password)
    return res.status(400).json({ message: "Email and password required" });

  const user = users.find(u => u.email === email);
  if (!user) return res.status(400).json({ message: "User not found" });

  const match = await bcrypt.compare(password, user.password);
  if (!match) return res.status(400).json({ message: "Invalid password" });

  const token = jwt.sign({ id: user.id, username: user.username }, JWT_SECRET, { expiresIn: "1h" });
  res.json({ id: user.id, username: user.username, email: user.email, token });
});

// Protected: get all users
app.get("/users", (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ message: "No token provided" });

  const token = authHeader.split(" ")[1];
  try {
    jwt.verify(token, JWT_SECRET);
    const safeUsers = users.map(u => ({ id: u.id, username: u.username, email: u.email }));
    res.json(safeUsers);
  } catch {
    res.status(401).json({ message: "Invalid token" });
  }
});

app.listen(5000, () => console.log("Backend running on http://localhost:5000"));
