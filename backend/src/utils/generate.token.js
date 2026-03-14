import jwt from "jsonwebtoken";

export const generateToken = (developerId) => {
    return jwt.sign({ developerId }, process.env.JWT_SECRET, {
        expiresIn: "5d",
    });
};