import express from "express";
import multer from "multer";
import path from "path";
import { getAllPorto } from "../controllers/porto.controller.js";

const storage = multer.diskStorage({
  destination: path.resolve("./public/uploads/porto"),
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({
  storage,
});

const uploadFields = upload.fields([
    { name: "Images", maxCount: 1 },
]);

const router = express.Router();

router.get("/", getAllPorto);

export default router;
