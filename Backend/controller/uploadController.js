import cloudinaryConfig from "../config/cloudinary.js";
import fs from 'fs';

export const uploadController = async (req, res) => {
    try {
        const file = req.file;
        if (!file) {
            return res.status(400).json({ message : "No file uploaded"})
        }
        const imageUrl = await cloudinaryConfig(file.path);
        return res.status(200).json({ imageUrl });

    } catch (error) {
        console.log('Error in uploadController:', error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
}