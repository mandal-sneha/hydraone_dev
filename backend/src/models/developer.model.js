import mongoose from "mongoose";

const developerSchema = new mongoose.Schema({
    developerId: {
        type: String,
        required: true,
        unique: true
    },
    developerName: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    }
}, { timestamps: true });

export const Developer = mongoose.model("Developer", developerSchema);