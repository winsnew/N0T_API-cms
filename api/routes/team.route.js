import express from "express";
import multer from "multer";
import path from "path";
import { v4 as uuidv4 } from "uuid";
import { fileURLToPath } from 'url';
import {
  getAllTeam,
  getProfileById,
  createProfile,
  updateProfile,
  deleteProfile,
} from "../controllers/team.controller.js";

const router = express.Router();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../public/uploads/team'));
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = `${Date.now()}-${uuidv4()}${path.extname(file.originalname)}`;
    cb(null, uniqueSuffix);
  },
});

const upload = multer({
  storage,
});

const uploadFields = upload.fields([
  { name: "Images", maxCount: 1 },
  { name: "stackImages", maxCount: 20 },
]);

router.get("/", getAllTeam);
router.get("/:id", getProfileById);
router.post(
  "/",
  uploadFields,
  createProfile
);
router.put("/:id",uploadFields, updateProfile);
router.delete("/:id", deleteProfile);

export default router;
