const express = require("express");
const multer = require("multer");
const fs = require("fs");
const { v4: uuidv4 } = require("uuid");
const { promisify } = require("util");

const router = express.Router();

// Configure multer for in-memory storage
const upload = multer({ storage: multer.memoryStorage() });

// Ensure the upload directories exist
const resumeDir = `${__dirname}/../public/resume/`;
const profileDir = `${__dirname}/../public/profile/`;

if (!fs.existsSync(resumeDir)) {
  fs.mkdirSync(resumeDir, { recursive: true });
}

if (!fs.existsSync(profileDir)) {
  fs.mkdirSync(profileDir, { recursive: true });
}

// Resume upload route
router.post("/resume", upload.single("file"), (req, res) => {
  const file = req.file;
  if (!file || file.mimetype !== "application/pdf") {
    return res.status(400).json({
      message: "Invalid format. Only PDF files are allowed.",
    });
  }

  const filename = `${uuidv4()}.pdf`;

  fs.writeFile(`${resumeDir}${filename}`, file.buffer, (err) => {
    if (err) {
      console.error(err); // Log the error
      return res.status(400).json({
        message: "Error while uploading",
      });
    }
    res.send({
      message: "Resume uploaded successfully",
      url: `/host/resume/${filename}`,
    });
  });
});

// Profile photo upload route
router.post("/profile", upload.single("file"), (req, res) => {
  const file = req.file;
  if (
    !file ||
    (file.mimetype !== "image/jpeg" && file.mimetype !== "image/png")
  ) {
    return res.status(400).json({
      message: "Invalid format. Only JPEG and PNG files are allowed.",
    });
  }

  const extension = file.mimetype === "image/jpeg" ? ".jpg" : ".png";
  const filename = `${uuidv4()}${extension}`;

  fs.writeFile(`${profileDir}${filename}`, file.buffer, (err) => {
    if (err) {
      console.error(err); // Log the error
      return res.status(400).json({
        message: "Error while uploading",
      });
    }
    res.send({
      message: "Profile image uploaded successfully",
      url: `/host/profile/${filename}`,
    });
  });
});

module.exports = router;
