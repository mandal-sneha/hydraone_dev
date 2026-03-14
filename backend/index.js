import express from "express";
import cors from 'cors';
import dotenv from 'dotenv';
import { ConnectDB } from "./src/lib/db.js";

import keyRoutes from "./src/routes/key.route.js";
import authRoutes from "./src/routes/auth.route.js";

dotenv.config();

const app = express();

app.use(cors({
    origin: "http://localhost:5173", 
    credentials: true, 
}));

app.use(express.json());

app.use("/auth", authRoutes);
app.use("/key", keyRoutes);

const PORT = process.env.PORT;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    ConnectDB();
});