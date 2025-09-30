const express = require('express');
const bcrypt = require('bcryptjs');
const { protect, authorize } = require('../middleware/auth');
const User = require('../models/User');
const ActivityLog = require('../models/ActivityLog');
const Data = require('../models/Data');

const router = express.Router();

// Protect all routes and authorize admin only
router.use(protect);
router.use(authorize('admin'));

// List all users
router.get('/', async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get user by id
router.get('/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create new user
router.post('/', async (req, res) => {
  try {
    const { username, email, password, role, isActive } = req.body;

    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: 'Email already exists' });
    }

    user = new User({ username, email, password, role, isActive });

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);

    await user.save();

    res.status(201).json({ message: 'User created', user: { id: user._id, username, email, role, isActive } });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update user
router.put('/:id', async (req, res) => {
  try {
    const { username, email, password, role, isActive } = req.body;

    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (username) user.username = username;
    if (email) user.email = email;
    if (role) user.role = role;
    if (typeof isActive === 'boolean') user.isActive = isActive;

    if (password) {
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, salt);
    }

    await user.save();

    res.json({ message: 'User updated', user: { id: user._id, username: user.username, email: user.email, role: user.role, isActive: user.isActive } });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete user
router.delete('/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    await user.remove();

    res.json({ message: 'User deleted' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get all activity logs
router.get('/activity', async (req, res) => {
  try {
    const logs = await ActivityLog.find().populate('user', 'username').sort({ timestamp: -1 }).limit(100);
    res.json(logs);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create activity log
router.post('/activity', async (req, res) => {
  try {
    const { user, action, details, ip } = req.body;

    const log = new ActivityLog({ user, action, details, ip });
    await log.save();

    res.status(201).json({ message: 'Activity logged', log });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get all data/files with pagination and filtering
router.get('/data', async (req, res) => {
  try {
    const { page = 1, limit = 20, search = '', user = '', sortBy = 'createdAt', sortOrder = 'desc' } = req.query;

    const query = {};
    if (search) {
      query.$or = [
        { filename: { $regex: search, $options: 'i' } },
        { originalName: { $regex: search, $options: 'i' } }
      ];
    }
    if (user) {
      query.user = user;
    }

    const sortOptions = {};
    sortOptions[sortBy] = sortOrder === 'desc' ? -1 : 1;

    const data = await Data.find(query)
      .populate('user', 'username email')
      .sort(sortOptions)
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Data.countDocuments(query);

    res.json({
      data,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / limit),
        totalItems: total,
        itemsPerPage: parseInt(limit)
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get specific data entry
router.get('/data/:id', async (req, res) => {
  try {
    const data = await Data.findById(req.params.id).populate('user', 'username email');
    if (!data) {
      return res.status(404).json({ message: 'Data not found' });
    }
    res.json(data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update data entry
router.put('/data/:id', async (req, res) => {
  try {
    const { data: dataContent, headers, description, tags, isPublic } = req.body;

    const dataEntry = await Data.findById(req.params.id);
    if (!dataEntry) {
      return res.status(404).json({ message: 'Data not found' });
    }

    if (dataContent) dataEntry.data = dataContent;
    if (headers) dataEntry.headers = headers;
    if (description !== undefined) dataEntry.description = description;
    if (tags) dataEntry.tags = tags;
    if (typeof isPublic === 'boolean') dataEntry.isPublic = isPublic;

    await dataEntry.save();

    // Log the activity
    const log = new ActivityLog({
      user: req.user.id,
      action: 'modified_data',
      details: `Modified data entry: ${dataEntry.filename}`,
      ip: req.ip
    });
    await log.save();

    res.json({ message: 'Data updated successfully', data: dataEntry });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete data entry
router.delete('/data/:id', async (req, res) => {
  try {
    const dataEntry = await Data.findById(req.params.id);
    if (!dataEntry) {
      return res.status(404).json({ message: 'Data not found' });
    }

    await dataEntry.remove();

    // Log the activity
    const log = new ActivityLog({
      user: req.user.id,
      action: 'deleted_data',
      details: `Deleted data entry: ${dataEntry.filename}`,
      ip: req.ip
    });
    await log.save();

    res.json({ message: 'Data deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get analytics data
router.get('/analytics', async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const activeUsers = await User.countDocuments({ isActive: true });
    const adminUsers = await User.countDocuments({ role: 'admin' });
    const totalUploads = await Data.countDocuments();
    const recentUploads = await Data.countDocuments({ createdAt: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) } }); // Last 30 days
    const publicFiles = await Data.countDocuments({ isPublic: true });
    const totalFileSize = await Data.aggregate([{ $group: { _id: null, total: { $sum: '$fileSize' } } }]);

    res.json({
      totalUsers,
      activeUsers,
      adminUsers,
      totalUploads,
      recentUploads,
      publicFiles,
      totalFileSize: totalFileSize[0]?.total || 0
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
