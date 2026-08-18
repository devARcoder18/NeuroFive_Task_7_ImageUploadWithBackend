const express = require("express");
const router = express.Router();
const { upload } = require("../middleware/uploadMiddleware");
const { uploadFile, getUploadHistory } = require("../controllers/uploadController");
// If your project already has an auth middleware, wire it in here:
// const { requireAuth } = require("../middleware/authMiddleware");

function handleMulterUpload(req, res, next) {
  upload.single("file")(req, res, (err) => {
    if (err) {
      if (err.code === "LIMIT_FILE_SIZE") {
        return res.status(400).json({
          success: false,
          message: "File is too large. Maximum allowed size is 5 MB.",
        });
      }
      return res.status(400).json({ success: false, message: "Invalid upload request." });
    }
    next();
  });
}

// router.post("/upload", requireAuth, handleMulterUpload, uploadFile);
router.post("/upload", handleMulterUpload, uploadFile);
router.get("/upload/history", getUploadHistory);

module.exports = router;
