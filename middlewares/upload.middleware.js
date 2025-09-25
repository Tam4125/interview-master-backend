import multer from "multer";

// Storage config: where and how to save files
const storage = multer.memoryStorage();

// File filter: accept only PDFs and Image
export const upload = multer({
    storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
    fileFilter: (req, file, cb) => {
        if (file.mimetype === "application/pdf" || file.mimetype.startsWith("image/")) {
            cb(null, true);
        } else {
            cb(new Error("Only PDF or image files are allowed!"), false);
        }
    }
});
