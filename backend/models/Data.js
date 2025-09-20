const mongoose = require('mongoose');
const Data = require('../models/Data');


const dataSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User is required']
  },
  filename: {
    type: String,
    required: [true, 'Filename is required'],
    trim: true
  },
  originalName: {
    type: String,
    required: [true, 'Original filename is required']
  },
  fileSize: {
    type: Number,
    required: [true, 'File size is required']
  },
  mimeType: {
    type: String,
    required: [true, 'MIME type is required']
  },
  filePath: {
    type: String,
    required: [true, 'File path is required']
  },
  sheetName: {
    type: String,
    default: 'Sheet1'
  },
  data: {
    type: [[mongoose.Schema.Types.Mixed]], // 2D array for Excel data
    required: [true, 'Data is required']
  },
  headers: {
    type: [String], // Array of column headers
    required: [true, 'Headers are required']
  },
  rowCount: {
    type: Number,
    required: [true, 'Row count is required'],
    min: [1, 'Must have at least 1 row']
  },
  columnCount: {
    type: Number,
    required: [true, 'Column count is required'],
    min: [1, 'Must have at least 1 column']
  },
  dataTypes: {
    type: Map,
    of: String, // Maps column index to detected data type
    default: new Map()
  },
  summary: {
    numericColumns: [String],
    textColumns: [String],
    dateColumns: [String],
    emptyCells: {
      type: Number,
      default: 0
    },
    totalCells: {
      type: Number,
      default: 0
    }
  },
  processingStatus: {
    type: String,
    enum: ['pending', 'processing', 'completed', 'failed'],
    default: 'pending'
  },
  processingError: {
    type: String,
    default: null
  },
  processingTime: {
    type: Number, // in milliseconds
    default: null
  },
  isPublic: {
    type: Boolean,
    default: false
  },
  tags: [{
    type: String,
    trim: true,
    lowercase: true
  }],
  description: {
    type: String,
    maxlength: [1000, 'Description cannot exceed 1000 characters']
  },
  metadata: {
    type: Map,
    of: mongoose.Schema.Types.Mixed,
    default: new Map()
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes for better query performance
dataSchema.index({ user: 1, createdAt: -1 });
dataSchema.index({ filename: 1 });
dataSchema.index({ processingStatus: 1 });
dataSchema.index({ isPublic: 1 });
dataSchema.index({ tags: 1 });
dataSchema.index({ 'summary.numericColumns': 1 });

// Virtual for data size in human readable format
dataSchema.virtual('fileSizeFormatted').get(function() {
  const bytes = this.fileSize;
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
});

// Virtual for data preview (first 5 rows)
dataSchema.virtual('preview').get(function() {
  if (!this.data || this.data.length === 0) return [];
  return this.data.slice(0, Math.min(6, this.data.length)); // Include headers + 5 data rows
});

// Instance method to get column data
dataSchema.methods.getColumnData = function(columnIndex) {
  if (columnIndex < 0 || columnIndex >= this.columnCount) {
    throw new Error('Invalid column index');
  }

  const columnData = [];
  for (let i = 1; i < this.data.length; i++) { // Skip header row
    columnData.push(this.data[i][columnIndex]);
  }
  return columnData;
};

// Instance method to get row data
dataSchema.methods.getRowData = function(rowIndex) {
  if (rowIndex < 0 || rowIndex >= this.rowCount) {
    throw new Error('Invalid row index');
  }
  return this.data[rowIndex];
};

// Instance method to detect data types for columns
dataSchema.methods.detectDataTypes = function() {
  const dataTypes = new Map();

  for (let col = 0; col < this.columnCount; col++) {
    let type = 'string';
    let hasNumbers = false;
    let hasDates = false;
    let hasBooleans = false;

    for (let row = 1; row < this.data.length; row++) { // Skip header
      const cell = this.data[row][col];
      if (cell === null || cell === undefined || cell === '') continue;

      const cellStr = String(cell).trim();

      // Check for boolean
      if (cellStr.toLowerCase() === 'true' || cellStr.toLowerCase() === 'false') {
        hasBooleans = true;
      }
      // Check for number
      else if (!isNaN(cell) && !isNaN(parseFloat(cell))) {
        hasNumbers = true;
      }
      // Check for date
      else if (!isNaN(Date.parse(cell))) {
        hasDates = true;
      }
    }

    if (hasBooleans && !hasNumbers && !hasDates) {
      type = 'boolean';
    } else if (hasNumbers && !hasDates) {
      type = 'number';
    } else if (hasDates && !hasNumbers) {
      type = 'date';
    }

    dataTypes.set(col, type);
  }

  this.dataTypes = dataTypes;
  return dataTypes;
};

// Static method to find public datasets
dataSchema.statics.findPublic = function(limit = 10, skip = 0) {
  return this.find({ isPublic: true })
    .populate('user', 'username fullName')
    .sort({ createdAt: -1 })
    .limit(limit)
    .skip(skip);
};

// Static method to find user's datasets
dataSchema.statics.findByUser = function(userId, limit = 20, skip = 0) {
  return this.find({ user: userId })
    .sort({ createdAt: -1 })
    .limit(limit)
    .skip(skip);
};

// Pre-save middleware to calculate summary
dataSchema.pre('save', function(next) {
  if (this.isModified('data')) {
    // Calculate summary statistics
    const summary = {
      numericColumns: [],
      textColumns: [],
      dateColumns: [],
      emptyCells: 0,
      totalCells: this.rowCount * this.columnCount
    };

    // Detect data types and build summary
    this.detectDataTypes();

    this.dataTypes.forEach((type, index) => {
      const header = this.headers[index];
      switch (type) {
        case 'number':
          summary.numericColumns.push(header);
          break;
        case 'date':
          summary.dateColumns.push(header);
          break;
        default:
          summary.textColumns.push(header);
      }
    });

    // Count empty cells
    for (let row = 0; row < this.data.length; row++) {
      for (let col = 0; col < this.data[row].length; col++) {
        const cell = this.data[row][col];
        if (cell === null || cell === undefined || cell === '') {
          summary.emptyCells++;
        }
      }
    }

    this.summary = summary;
  }
  next();
});

module.exports = mongoose.model('Data', dataSchema);
