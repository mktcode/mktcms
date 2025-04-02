import { S3Client, HeadObjectCommand } from "@aws-sdk/client-s3";

export function createS3Client() {
  const { s3AccessKey, s3SecretKey, public: { s3Endpoint } } = useRuntimeConfig();
  
  return new S3Client({
    region: "eu-central",
    credentials: {
      accessKeyId: s3AccessKey,
      secretAccessKey: s3SecretKey,
    },
    endpoint: s3Endpoint
  });
}

export async function s3FileExists(bucket: string, fileKey: string) {
  const s3 = createS3Client();
  const command = new HeadObjectCommand({
    Bucket: bucket,
    Key: fileKey,
  });

  try {
    await s3.send(command);
    return true;
  } catch (error: any) {
    if (error.name === "NotFound") {
      return false;
    }
    throw error;
  }
}