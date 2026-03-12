import express from "express";
import cors from 'cors';
import dotenv from 'dotenv';
import { ConnectDB } from "./src/lib/db.js";

dotenv.config();

const app = express();

app.use(cors({
    origin: "http://localhost:5173", 
    credentials: true, 
}));

app.use(express.json());

const PORT = process.env.PORT;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    ConnectDB();
});