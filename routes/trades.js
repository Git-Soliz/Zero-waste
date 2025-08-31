import express from "express";
import pool from "../db.js";

const router = express.Router();

// Create trade
router.post("/", async (req, res) => {
  const { item_offered, item_requested } = req.body;
  try {
    const result = await pool.query(
      "INSERT INTO trades (item_offered, item_requested) VALUES ($1,$2) RETURNING *",
      [item_offered, item_requested]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error creating trade");
  }
});

// Get all trades
router.get("/", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM trades");
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error fetching trades");
  }
});

// Update trade status
router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  try {
    const result = await pool.query(
      "UPDATE trades SET status=$1 WHERE id=$2 RETURNING *",
      [status, id]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error updating trade");
  }
});

export default router;
