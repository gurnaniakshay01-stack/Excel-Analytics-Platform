const express = require('express');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const { protect } = require('../middleware/auth');
const Data = require('../models/Data');

const router = express.Router();

// Configure multer storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = path.join(__dirname, '..', 'uploads');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir);
    }
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + '-' + file.originalname);
  }
});

const upload = multer({ storage });

// Upload file
router.post('/', protect, upload.single('file'), async (req, res) => {
  try {
    const file = req.file;
    if (!file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const data = new Data({
      user: req.user._id,
      originalName: file.originalname,
      filename: file.filename,
      path: file.path,
      size: file.size,
      processingStatus: 'pending',
    });

    await data.save();

    res.status(201).json({ message: 'File uploaded', data });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// List files for user
router.get('/', protect, async (req, res) => {
  try {
    const files = await Data.find({ user: req.user._id }).sort({ uploadDate: -1 });
    res.json(files);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete file by id
router.delete('/:id', protect, async (req, res) => {
  try {
    const file = await Data.findById(req.params.id);
    if (!file) {
      return res.status(404).json({ message: 'File not found' });
    }
    if (file.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to delete this file' });
    }

    // Delete file from disk
    fs.unlink(file.path, (err) => {
      if (err) {
        console.error('Failed to delete file from disk:', err);
      }
    });

    await file.remove();

    res.json({ message: 'File deleted' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
