import { S3Client } from "@aws-sdk/client-s3";

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