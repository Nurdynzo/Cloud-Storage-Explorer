import dotenv from "dotenv";
import { ConfigTypes } from "../config/types";
dotenv.config();

export const config: ConfigTypes = {
  AZURE_STORAGE_CONNECTION_STRING:
    process.env.AZURE_STORAGE_CONNECTION_STRING || "",
  CONTAINER_NAME: process.env.CONTAINER_NAME || "",
  ALLOWED_FOLDERS: (process.env.ALLOWED_FOLDERS || "").split(","),
};
