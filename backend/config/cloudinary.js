import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

cloudinary.api
  .ping()
  .then((result) => {
    console.log("Cloudinary Ping:", result);
  })
  .catch((error) => {
    console.error("Cloudinary Ping Error:", error);
  });

export default cloudinary;
