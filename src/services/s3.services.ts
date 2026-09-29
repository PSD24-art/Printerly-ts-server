// services/s3.service.ts

import { PutObjectCommand } from "@aws-sdk/client-s3";
import s3 from "../config/s3.js";

export const uploadFileToS3 = async (file: Express.Multer.File, key: string) => {
  const command = new PutObjectCommand({
    Bucket: process.env.AWS_S3_BUCKET_NAME!,
    Key: key,
    Body: file.buffer,
    ContentType: file.mimetype,
  });

  await s3.send(command);

  return key;
};
