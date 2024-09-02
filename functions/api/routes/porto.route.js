import express from "express";
import multer from "multer";
import path from "path";
import { v4 as uuidv4 } from "uuid";
import { fileURLToPath } from 'url';
import { getAllPorto, createPortfolio, getPortoById, updatePortfolio, deletePorto } from "../controllers/porto.controller.js";

const router = express.Router();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../public/uploads/porto'));
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
]);


router.get("/", getAllPorto);
router.get("/:id", getPortoById);
router.post(
  "/",
  uploadFields,
  createPortfolio
);
router.put("/:id", uploadFields, updatePortfolio)
router.delete("/:id", deletePorto);

export default router;
