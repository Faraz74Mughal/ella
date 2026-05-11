import { v2 as cloudinary } from "cloudinary";
import fs from "fs/promises";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const saveOnCloudinary = async (localFilePath: string,folderPaths: string ="general" ) => {
  try {
    if (!localFilePath) {
      throw new Error("Local file path is required");
    }

    const response = await cloudinary.uploader.upload(localFilePath, {
      resource_type: "auto",
      folder: folderPaths,
    });

    // remove temp file
    await fs.unlink(localFilePath);

    return {
      url: response.secure_url,
      public_id: response.public_id,
      resource_type: response.resource_type,
    };
  } catch (error) {
    console.error(
      "Cloudinary Upload Error:",
      (error as Error).message
    );

    try {
      await fs.unlink(localFilePath);
    } catch {
      // ignore cleanup errors
    }

    throw error;
  }
};

export const deleteFromCloudinary = async (
  publicId: string,
  resourceType: "image" | "video" | "raw" | "auto" = "auto"
) => {
  if (!publicId) return;

  return await cloudinary.uploader.destroy(publicId, {
    resource_type: resourceType,
  });
};