import jwt from "jsonwebtoken";
import { Developer } from "../models/developer.model.js";

export const protectRoute = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({ message: "Unauthorized - No Token Provided" });
        }

        const token = authHeader.split(" ")[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        if (!decoded) {
            return res.status(401).json({ message: "Unauthorized - Invalid Token" });
        }

        const developer = await Developer.findOne({ developerId: decoded.developerId }).select("-password");

        if (!developer) {
            return res.status(404).json({ message: "Developer not found" });
        }

        req.developer = developer;
        next();
    } catch (error) {
        res.status(401).json({ message: "Unauthorized - Token Expired or Invalid" });
    }
};