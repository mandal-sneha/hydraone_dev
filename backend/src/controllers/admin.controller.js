import { Key } from "../models/key.model.js";

export const getAllAdminKeys = async (req, res) => {
    try {
        const allKeys = await Key.find();

        const formattedData = allKeys.reduce((acc, item) => {
            const { state, district, municipality, adminLevel, adminName, key } = item;

            if (!acc[state]) {
                acc[state] = { 
                    stateAdmin: null,
                    districts: {} 
                };
            }

            const adminInfo = { adminName, key, adminLevel };

            if (adminLevel === "state") {
                acc[state].stateAdmin = adminInfo;
            } 
            
            else if (adminLevel === "district") {
                if (!acc[state].districts[district]) {
                    acc[state].districts[district] = { 
                        districtAdmin: null,
                        municipalities: {} 
                    };
                }
                acc[state].districts[district].districtAdmin = adminInfo;
            } 
            
            else if (adminLevel === "municipality") {
                if (!acc[state].districts[district]) {
                    acc[state].districts[district] = { 
                        districtAdmin: null, 
                        municipalities: {} 
                    };
                }
                acc[state].districts[district].municipalities[municipality] = {
                    municipalityAdmin: adminInfo
                };
            }

            return acc;
        }, {});

        return res.status(200).json({
            success: true,
            data: formattedData
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};