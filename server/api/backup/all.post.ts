import archiver from "archiver";

export default defineEventHandler(async (event) => {
  const archive = archiver('zip', { zlib: { level: 9 } });
  archive.on("error", function (err) {
    throw err;
  });
  archive.directory('public/files', 'files');
  await archive.finalize();

  setResponseHeader(event, 'Content-Type', 'application/zip');
  setResponseHeader(event, 'Content-Disposition', 'attachment; filename=files.zip');

  return sendStream(event, archive);
});