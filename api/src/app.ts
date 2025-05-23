import express from "express";
import cors from "cors";
import filesRoutes from "./routes/files.routes";

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api", filesRoutes);

export default app;
