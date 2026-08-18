const streamifier = require("streamifier");
const cloudinary = require("../config/cloudinary");
const Upload = require("../models/Upload");
const { ALLOWED_MIME_TYPES } = require("../middleware/uploadMiddleware");

const CLOUDINARY_FOLDER = "fullstack-app/uploads";

function uploadBufferToCloudinary(buffer, folder) {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder,
        resource_type: "image",
        // Cloudinary generates a random public_id -> never trust the
        // original filename as a storage identifier.
      },
      (error, result) => {
        if (error) return reject(error);
        resolve(result);
      }
    );
    streamifier.createReadStream(buffer).pipe(uploadStream);
  });
}

exports.uploadFile = async (req, res) => {
  try {
    // Multer rejected the file before it ever reached this handler.
    if (req.fileValidationError) {
      return res.status(400).json({ success: false, message: req.fileValidationError });
    }

    if (!req.file) {
      return res.status(400).json({ success: false, message: "Please select a file." });
    }

    // Defense in depth: re-check MIME server-side even though multer already filtered.
    if (!ALLOWED_MIME_TYPES.includes(req.file.mimetype)) {
      return res.status(400).json({ success: false, message: "Invalid file type." });
    }

    const result = await uploadBufferToCloudinary(req.file.buffer, CLOUDINARY_FOLDER);

    const fileData = {
      url: result.secure_url,
      publicId: result.public_id,
      name: req.file.originalname,
      type: req.file.mimetype,
      size: req.file.size,
      width: result.width,
      height: result.height,
    };

    // Optional: persist history if the model/DB is wired up.
    try {
      await Upload.create({
        fileName: fileData.name,
        fileUrl: fileData.url,
        publicId: fileData.publicId,
        fileType: fileData.type,
        fileSize: fileData.size,
        width: fileData.width,
        height: fileData.height,
        userId: req.user ? req.user._id : undefined, // set by auth middleware, if present
      });
    } catch (dbErr) {
      // Don't fail the whole upload just because history logging failed.
      console.error("Upload history save failed:", dbErr.message);
    }

    return res.status(200).json({
      success: true,
      message: "File uploaded successfully",
      file: fileData,
    });
  } catch (err) {
    console.error("Cloudinary upload error:", err.message);
    return res.status(500).json({
      success: false,
      message: "Unable to upload file. Please try again.",
    });
  }
};

exports.getUploadHistory = async (req, res) => {
  try {
    const filter = req.user ? { userId: req.user._id } : {};
    const uploads = await Upload.find(filter).sort({ createdAt: -1 }).limit(20);
    return res.status(200).json({ success: true, uploads });
  } catch (err) {
    console.error("Fetch upload history error:", err.message);
    return res.status(500).json({ success: false, message: "Unable to load upload history." });
  }
};
