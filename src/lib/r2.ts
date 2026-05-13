import { S3Client, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

export const r2 = new S3Client({
  region: "auto",
  endpoint: process.env.R2_ENDPOINT,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID!,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!,
  },
});

export const R2_BUCKET = process.env.R2_BUCKET!;

export async function getDownloadUrl(fileKey: string): Promise<string> {
  try {
    if (!fileKey) {
      throw new Error('fileKey is required');
    }

    const command = new GetObjectCommand({
      Bucket: R2_BUCKET,
      Key: fileKey,
    });

    const signedUrl = await getSignedUrl(r2, command, { expiresIn: 3600 }); // 1 hour
    
    return signedUrl;
  } catch (error) {
    console.error('Failed to generate download URL for fileKey:', fileKey, error);
    throw new Error('Unable to generate download link');
  }
}
