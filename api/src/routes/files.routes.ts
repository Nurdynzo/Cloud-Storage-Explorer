import { getFiles, downloadFiles } from "../controllers/files.controller";
import { Router } from "express";

const router = Router();

// List files in dev and staging folders
router.get("/files", getFiles);

// Generate signed URL for file download
router.get("/download", downloadFiles);

export default router;
