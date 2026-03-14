import mongoose from "mongoose";

const keySchema = new mongoose.Schema({
    key: {
        type: String,
        maxLength: 10,
        required: true,
        unique: true
    },
    adminLevel: {
        type: String,
        enum: ["state", "district", "municipality"],
        required: true
    },
    adminName: {
        type: String,
        required: true
    },
    municipality: {
        type: String,
    },
    district: {
        type: String,
    },
    state: {
        type: String,
        required: true
    }
}, { timestamps: true });

export const Key = mongoose.model("AdminKey", keySchema);