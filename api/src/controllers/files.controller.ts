import { Request, Response } from "express";
import { BlobServiceClient, BlobSASPermissions } from "@azure/storage-blob";
import { FileInfo } from "../interface/files.interface";
import { config } from "../config";

const { AZURE_STORAGE_CONNECTION_STRING, CONTAINER_NAME, ALLOWED_FOLDERS } =
  config;

const blobServiceClient = BlobServiceClient.fromConnectionString(
  AZURE_STORAGE_CONNECTION_STRING
);

export const getFiles = async (_req: Request, res: Response) => {
  try {
    const containerClient =
      blobServiceClient.getContainerClient(CONTAINER_NAME);
    const files: FileInfo[] = [];

    for (const folder of ALLOWED_FOLDERS) {
      for await (const blob of containerClient.listBlobsFlat({
        prefix: folder,
      })) {
        const blockBlobClient = containerClient.getBlockBlobClient(blob.name);
        const properties = await blockBlobClient.getProperties();
        files.push({
          name: blob.name.split("/").pop() || "",
          folder,
          lastModified: properties.lastModified || new Date(),
          size: properties.contentLength || 0,
        });
      }
    }
    res.json(files);
  } catch (error) {
    console.error("Error listing files:", error);
    res.status(500).json({ error: "Failed to list files" });
  }
};

// Generate signed URL for file download
export const downloadFiles = async (req: Request, res: Response) => {
  try {
    const { blobName } = req.query;

    const containerClient =
      blobServiceClient.getContainerClient(CONTAINER_NAME);
    const blockBlobClient = containerClient.getBlockBlobClient(
      blobName as string
    );

    // Generate a 1-hour SAS URL for download
    const expiresOn = new Date(new Date().getTime() + 60 * 60 * 1000);
    const sasUrl = await blockBlobClient.generateSasUrl({
      expiresOn,
      permissions: BlobSASPermissions.parse("r"),
    });

    res.json({ url: sasUrl });
  } catch (error) {
    console.error("Error generating download URL:", error);
    res.status(500).json({ error: "Failed to generate download URL" });
  }
};
