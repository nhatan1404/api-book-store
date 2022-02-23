export default (): Record<string, string | number> => ({
  pathImageBook: process.env.UPLOAD_PATH_IMAGES_BOOK,
  pathImagAvatar: process.env.UPLOAD_PATH_IMAGES_AVATAR,
  maxFileSize: process.env.UPLOAD_MAX_FILE_SIZE,
  maxImageSize: process.env.MAX_IMAGE_SIZE,
  allowedExtImg: process.env.ALLOWED_EXT_IMAGE,
});
