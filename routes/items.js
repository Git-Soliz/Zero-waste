import express from "express";
import pool from "../db.js";
import { verifyToken } from "./authMiddleware.js";

const router = express.Router();

// GET all items
router.get("/", async (req, res) => {
  try {
    const items = await pool.query("SELECT * FROM items");
    res.json(items.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
});

// POST new item
router.post("/", verifyToken, async (req, res) => {
  const { name, description } = req.body;
  const owner_id = req.user.id;

  if (!name) return res.status(400).json({ message: "Name required" });

  try {
    const result = await pool.query(
      "INSERT INTO items (name, description, owner_id) VALUES ($1, $2, $3) RETURNING *",
      [name, description || "", owner_id]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
});

// GET single item by id
router.get("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query("SELECT * FROM items WHERE id=$1", [id]);
    if (result.rows.length === 0) return res.status(404).json({ message: "Item not found" });
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
});

export default router;
