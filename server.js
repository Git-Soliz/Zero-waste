import express from "express";
import dotenv from "dotenv";
import usersRoutes from "./routes/users.js";
import itemsRoutes from "./routes/items.js";
import tradesRoutes from "./routes/trades.js";
const cors = require("cors");
const authRoutes = require("./routes/authRoutes");

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

// ROUTES
app.use("/auth", authRoutes);
app.use("/users", userRoutes);
app.use("/items", itemRoutes);
app.use("/trades", tradeRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
