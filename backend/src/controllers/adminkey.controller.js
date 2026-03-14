import { Key } from "../models/key.model.js";

const generateRandomAlphaNumeric = () => {
    const charset = "abcdefghijkmnpqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ23456789";
    let result = "";
    for (let i = 0; i < 10; i++) {
        result += charset.charAt(Math.floor(Math.random() * charset.length));
    }
    return result;
};

const getUniqueKey = async () => {
    let key;
    let isUnique = false;
    while (!isUnique) {
        key = generateRandomAlphaNumeric();
        const existingKey = await Key.findOne({ key });
        if (!existingKey) isUnique = true;
    }
    return key;
};

const generateStateLevelAdminKey = async (adminName, state) => {
    const key = await getUniqueKey();
    return await Key.create({
        key,
        adminLevel: "state",
        adminName,
        state,
        district: "",
        municipality: ""
    });
};

const generateDistrictLevelAdminKey = async (adminName, state, district) => {
    const key = await getUniqueKey();
    return await Key.create({
        key,
        adminLevel: "district",
        adminName,
        state,
        district,
        municipality: ""
    });
};

const generateMunicipalityLevelAdminKey = async (adminName, state, district, municipality) => {
    const key = await getUniqueKey();
    return await Key.create({
        key,
        adminLevel: "municipality",
        adminName,
        state,
        district,
        municipality
    });
};

export const generateAdminKey = async (req, res) => {
    try {
        const { adminLevel, adminName, state, district, municipality } = req.body;

        if (!adminName) {
            return res.status(400).json({ success: false, message: "adminName is required" });
        }

        const existingAdmin = await Key.findOne({
            adminLevel,
            state: state || "",
            district: district || "",
            municipality: municipality || ""
        });

        if (existingAdmin) {
            return res.status(409).json({
                success: false,
                message: "Admin already exists for this location",
                existingAdmin: {
                    adminName: existingAdmin.adminName,
                    adminLevel: existingAdmin.adminLevel,
                    state: existingAdmin.state,
                    district: existingAdmin.district,
                    municipality: existingAdmin.municipality
                }
            });
        }

        let newKeyData;

        if (adminLevel === "state") {
            if (!state) return res.status(400).json({ message: "State name required" });
            newKeyData = await generateStateLevelAdminKey(adminName, state);
        } else if (adminLevel === "district") {
            if (!state || !district) return res.status(400).json({ message: "State and District names required" });
            newKeyData = await generateDistrictLevelAdminKey(adminName, state, district);
        } else if (adminLevel === "municipality") {
            if (!state || !district || !municipality) return res.status(400).json({ message: "State, District, and Municipality names required" });
            newKeyData = await generateMunicipalityLevelAdminKey(adminName, state, district, municipality);
        } else {
            return res.status(400).json({ message: "Invalid admin level" });
        }

        res.status(201).json({
            success: true,
            data: newKeyData
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};