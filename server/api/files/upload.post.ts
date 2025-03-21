import sharp from 'sharp';
import { PutObjectCommand } from "@aws-sdk/client-s3";

export default defineEventHandler(async (event) => {
  const { user } = await requireUserSession(event);

  const files = await readMultipartFormData(event);

  if (!files) {
    return { success: false, message: 'No files found' };
  }

  const s3 = createS3Client();
  
  for (const file of files) {
    const isImage = file.type?.startsWith('image');
    const isPdf = file.type === 'application/pdf';

    if (!isImage && !isPdf) {
      return { success: false, message: 'Only images and PDF files are allowed' };
    }

    const fileName = file.filename || Math.random().toString(36).substring(7);
    const sanitizedFilename = fileName.replace(/[^a-z0-9.]/gi, '_');
    const timestamp = new Date().getTime();
    const filePath = `${user.id}/${timestamp}-${sanitizedFilename}`;

    if (isImage) {
      const image = sharp(file.data);
      const metadata = await image.metadata();

      // ensure max dimensions of 2000x2000 and resize
      const maxSize = 2000;
      if (metadata.width && metadata.height && (metadata.width > maxSize || metadata.height > maxSize)) {
        image.resize(maxSize, maxSize, { fit: 'inside' });
      }

      // reduce quality if file size is larger than 1MB
      if (metadata.size && metadata.size > 1e6) {
        image.jpeg({ quality: 75 });
        if (metadata.size && metadata.size > 1e6) {
          image.jpeg({ quality: 50 });
        }
      }

      // replace current extension in filepath with webp
      const webpFilePath = filePath.replace(/\.[^/.]+$/, '.webp');

      const command = new PutObjectCommand({
        Bucket: 'mktcms',
        Key: webpFilePath,
        Body: Buffer.from(await image.toFormat('webp').toBuffer()),
        ContentType: 'image/webp',
        Metadata: {
          'filename': fileName,
        },
      });
      await s3.send(command);
    } else {
      const command = new PutObjectCommand({
        Bucket: 'mktcms',
        Key: filePath,
        Body: file.data,
        ContentType: file.type,
        Metadata: {
          'filename': fileName,
        },
      });
      await s3.send(command);
    }
  }

  return { success: true, message: 'Files uploaded' };
});