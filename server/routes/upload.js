const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');

// Set up multer for local storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, '../uploads'));
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + '-' + file.originalname);
  }
});
const upload = multer({ storage });

// POST /api/upload - single image
router.post('/', upload.single('image'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }
  // Return relative path for DB
  const filePath = `/uploads/${req.file.filename}`;
  res.json({ url: filePath });
});

module.exports = router;
