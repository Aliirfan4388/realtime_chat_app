import express from "express";
import authRoutes from "./routes/auth.route.js"
import dotenv from "dotenv"
import { connectDB } from "./lib/db.js";
import cookieParser from "cookie-parser";
import Message from "./models/message.model.js";
import messageRoutes from "./routes/message.router.js";
import cors from "cors";

import path from "path";
import { app,server } from "./lib/socket.js";

dotenv.config();
const __dirname = path.resolve();
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../frontend/dist")));

  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "../frontend", "dist", "index.html"));
  });
  
}

const PORT = process.env.PORT;

app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

app.use("/api/auth",authRoutes);
app.use("/api/messages",messageRoutes);


server.listen(PORT, () => {
    console.log("server listning on port 5001");
    connectDB()
});
