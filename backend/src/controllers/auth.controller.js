import { Developer } from "../models/developer.model.js";
import bcrypt from "bcryptjs";
import { generateToken } from "../utils/generate.token.js";

export const developerSignup = async (req, res) => {
    try {
        const { developerName, developerId, password } = req.body;

        if (!developerName || !developerId || !password) {
            return res.status(400).json({ message: "All fields are required" });
        }

        const existingDev = await Developer.findOne({ developerId });
        if (existingDev) {
            return res.status(400).json({ message: "Developer ID already exists" });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newDeveloper = await Developer.create({
            developerName,
            developerId,
            password: hashedPassword,
        });

        const token = generateToken(newDeveloper.developerId);

        res.status(201).json({
            success: true,
            token: token,
            developer: {
                id: newDeveloper.developerId,
                name: newDeveloper.developerName,
            },
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const developerLogin = async (req, res) => {
    try {
        const { developerId, password } = req.body;

        const developer = await Developer.findOne({ developerId });
        if (!developer) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        const isPasswordCorrect = await bcrypt.compare(password, developer.password);
        if (!isPasswordCorrect) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        const token = generateToken(developer.developerId);

        res.status(200).json({
            success: true,
            token: token,
            developer: {
                id: developer.developerId,
                name: developer.developerName,
            },
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};