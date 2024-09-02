import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import path from 'path'
import { fileURLToPath } from 'url';
import userRoute from "./routes/user.route.js";
import authRoute from "./routes/auth.route.js";
import teamRoute from "./routes/team.route.js";
import portoRoute from "./routes/porto.route.js";


dotenv.config();

mongoose
  .connect(process.env.CLOUD)
  .then(() => {
    console.log("MongoDb is connected");
  })
  .catch((err) => {
    console.log(err);
  });

const app = express();
app.use(
  cors({
    origin: ["*"],
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);


app.use(express.json());

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use('/uploads', express.static(path.join(__dirname, '/public/uploads/')));

app.listen(8000, () => {
  console.log("server is running");
});

app.use("/api/user", userRoute);
app.use("/api/auth", authRoute);
app.use("/api/team", teamRoute);
app.use("/api/porto", portoRoute);


app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const msg = err.message || "Internal Server Error";
  res.status(statusCode).json({
    success: false,
    statusCode,
    msg,
  });
});

