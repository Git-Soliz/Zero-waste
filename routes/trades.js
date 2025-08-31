import express from "express";
import pool from "../db.js";
import { verifyToken } from "./authMiddleware.js";

const router = express.Router();

// GET all trades
router.get("/", verifyToken, async (req, res) => {
  try {
    const trades = await pool.query("SELECT * FROM trades");
    res.json(trades.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
});

// POST new trade
router.post("/", verifyToken, async (req, res) => {
  const { item_offered, item_requested } = req.body;

  if (!item_offered || !item_requested)
    return res.status(400).json({ message: "Both item IDs required" });

  try {
    const result = await pool.query(
      "INSERT INTO trades (item_offered, item_requested) VALUES ($1, $2) RETURNING *",
      [item_offered, item_requested]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
});

// PATCH trade status
router.patch("/:id", verifyToken, async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  if (!status) return res.status(400).json({ message: "Status required" });

  try {
    const result = await pool.query(
      "UPDATE trades SET status=$1 WHERE id=$2 RETURNING *",
      [status, id]
    );
    if (result.rows.length === 0) return res.status(404).json({ message: "Trade not found" });
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
});

export default router;
