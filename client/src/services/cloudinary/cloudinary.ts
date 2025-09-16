import { CLOUDINARY_CLOUD_NAME, CLOUDINARY_UPLOAD_PRESET } from "@/config";

interface ICloudinaryResponse {
  secure_url: string;
  public_id: string;
  resource_type: string;
  format: string;
  bytes: number;
}

export const uploadToCloudinary = async (
  file: File,
  resource_type: "image" | "video" = "image"
): Promise<ICloudinaryResponse> => {
  const formdata = new FormData();
  formdata.append("file", file);
  formdata.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);
  formdata.append("cloud_name", CLOUDINARY_CLOUD_NAME);

  if (resource_type === "video") {
    formdata.append("resource_type", "video");
  }

  const response =await fetch(`https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/${resource_type}/upload`,
    {
        method:"POST",
        body:formdata
    }
  )

  if(!response.ok){
    throw new Error('Failed to upload to Cloudinary')
    
  }

  return response.json()
 
};
