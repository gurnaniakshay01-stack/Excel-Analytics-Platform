const express = require('express');
const { protect } = require('../middleware/auth');
const Data = require('../models/Data');

const router = express.Router();

// Generate chart data for a file
router.get('/generate/:fileId', protect, async (req, res) => {
  try {
    const data = await Data.findById(req.params.fileId);
    if (!data) {
      return res.status(404).json({ message: 'Data file not found' });
    }
    if (data.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    // Example: return headers and first 10 rows as chart data
    const chartData = {
      headers: data.headers,
      rows: data.data.slice(0, 10),
    };

    res.json(chartData);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get columns for a file
router.get('/columns/:fileId', protect, async (req, res) => {
  try {
    const data = await Data.findById(req.params.fileId);
    if (!data) {
      return res.status(404).json({ message: 'Data file not found' });
    }
    if (data.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    res.json({ columns: data.headers });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get chart templates (static or from DB)
router.get('/templates', protect, (req, res) => {
  // Example static templates
  const templates = [
    { id: 'line', name: 'Line Chart' },
    { id: 'bar', name: 'Bar Chart' },
    { id: 'pie', name: 'Pie Chart' },
    { id: 'candlestick', name: 'Candlestick Chart' },
  ];
  res.json(templates);
});

// Save chart configuration
router.post('/save', protect, async (req, res) => {
  try {
    const { fileId, config } = req.body;
    const data = await Data.findById(fileId);
    if (!data) {
      return res.status(404).json({ message: 'Data file not found' });
    }
    if (data.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    // Save chart config in data.summary or a separate collection as needed
    data.summary.chartConfig = config;
    await data.save();

    res.json({ message: 'Chart configuration saved' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
