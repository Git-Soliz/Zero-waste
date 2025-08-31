import express from "express";
import dotenv from "dotenv";
import cors from "cors";

import usersRoutes from "./routes/users.js";
import itemsRoutes from "./routes/items.js";
import tradesRoutes from "./routes/trades.js";
import authRoutes from "./routes/authRoutes.js"; // mūsų JWT auth

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

// ROUTES
app.use("/auth", authRoutes);
app.use("/users", usersRoutes);
app.use("/items", itemsRoutes);
app.use("/trades", tradesRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
