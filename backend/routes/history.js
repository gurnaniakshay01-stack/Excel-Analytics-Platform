const express = require('express');
const { protect } = require('../middleware/auth');
const Data = require('../models/Data');

const router = express.Router();

// List history of uploaded files for user
router.get('/', protect, async (req, res) => {
  try {
    const history = await Data.find({ user: req.user._id }).sort({ uploadDate: -1 });
    res.json(history);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get file details by id
router.get('/:id', protect, async (req, res) => {
  try {
    const file = await Data.findById(req.params.id);
    if (!file) {
      return res.status(404).json({ message: 'File not found' });
    }
    if (file.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }
    res.json(file);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get stats (example: count of files, total size)
router.get('/stats/summary', protect, async (req, res) => {
  try {
    const files = await Data.find({ user: req.user._id });
    const totalFiles = files.length;
    const totalSize = files.reduce((acc, file) => acc + file.size, 0);

    res.json({ totalFiles, totalSize });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
