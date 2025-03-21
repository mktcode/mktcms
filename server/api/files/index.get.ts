import sharp from 'sharp';
import { ListObjectsV2Command } from "@aws-sdk/client-s3";

export default defineEventHandler(async (event) => {
  const { user } = await requireUserSession(event);

  const s3 = createS3Client();
  const command = new ListObjectsV2Command({
    Bucket: 'mktcms',
    Prefix: `${user.id}/`,
  });
  const result = await s3.send(command);

  const files = (result.Contents || [])
    .map((obj) => ({
      key: obj.Key || '',
      size: obj.Size || 0,
    }));

  return files;
});