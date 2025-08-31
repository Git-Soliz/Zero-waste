import express from "express";
import pool from "../db.js";

const router = express.Router();

// Get all items
router.get("/", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM items");
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error fetching items");
  }
});

// Add new item
router.post("/", async (req, res) => {
  const { user_id, title, description, category, condition } = req.body;
  try {
    const result = await pool.query(
      "INSERT INTO items (user_id, title, description, category, condition) VALUES ($1,$2,$3,$4,$5) RETURNING *",
      [user_id, title, description, category, condition]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error adding item");
  }
});

export default router;
