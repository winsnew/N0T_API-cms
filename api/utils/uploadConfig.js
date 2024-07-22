import multer from "multer";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

/// Define storage configuration for multer
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // Set the destination folder for uploaded files
    cb(null, "./api/uploads");
  },
  filename: function (req, file, cb) {
    // Set the filename with a unique timestamp to avoid collisions
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

// Create the multer instance
const upload = multer({ storage: storage });

export { upload };
