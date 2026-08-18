const multer = require("multer");
const path = require("path");

// Files are kept in memory only long enough to stream to Cloudinary.
// Nothing is written permanently to disk / the repo.
const storage = multer.memoryStorage();

const ALLOWED_MIME_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
const ALLOWED_EXTENSIONS = [".jpg", ".jpeg", ".png", ".webp"];
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB

function fileFilter(req, file, cb) {
  const ext = path.extname(file.originalname).toLowerCase();

  const mimeOk = ALLOWED_MIME_TYPES.includes(file.mimetype);
  const extOk = ALLOWED_EXTENSIONS.includes(ext);

  if (!mimeOk || !extOk) {
    // Reject with a flag we can read in the controller instead of
    // letting multer throw a raw, unhandled error.
    req.fileValidationError = "Unsupported file type. Please upload JPG, PNG, or WEBP.";
    return cb(null, false);
  }

  cb(null, true);
}

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: MAX_FILE_SIZE,
    files: 1,
  },
});

module.exports = { upload, MAX_FILE_SIZE, ALLOWED_MIME_TYPES, ALLOWED_EXTENSIONS };
