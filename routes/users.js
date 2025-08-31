import express from "express";
import pool from "../db.js";
import bcrypt from "bcrypt";

const router = express.Router();

// Register
router.post("/register", async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const hashed = await bcrypt.hash(password, 10);
    const result = await pool.query(
      "INSERT INTO users (name, email, password) VALUES ($1,$2,$3) RETURNING id, name, email, verified",
      [name, email, hashed]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).send("Registration error");
  }
});

// Login
router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const result = await pool.query("SELECT * FROM users WHERE email=$1", [email]);
    if (result.rows.length === 0) return res.status(400).send("User not found");

    const user = result.rows[0];
    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(400).send("Invalid password");

    res.json({ id: user.id, name: user.name, email: user.email, verified: user.verified });
  } catch (err) {
    console.error(err);
    res.status(500).send("Login error");
  }
});

export default router;
