const express = require('express');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const { protect } = require('../middleware/auth');
const Data = require('../models/Data');

const router = express.Router();

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || 'your-api-key-here');

// Get AI chat response
router.post('/chat', protect, async (req, res) => {
  try {
    const { message, dataId } = req.body;

    if (!message) {
      return res.status(400).json({
        success: false,
        message: 'Message is required'
      });
    }

    // Get data context if dataId is provided
    let dataContext = '';
    if (dataId) {
      const data = await Data.findById(dataId);
      if (data) {
        dataContext = `
Data Context:
- File Name: ${data.filename}
- Total Rows: ${data.data.length}
- Columns: ${Object.keys(data.data[0] || {}).join(', ')}
- Sample Data: ${JSON.stringify(data.data.slice(0, 5), null, 2)}

`;
      }
    }

    // Create the model
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    // Create context-aware prompt
    const prompt = `
You are an AI assistant for an Excel Analytics Platform. Help users analyze their data and provide insights.

${dataContext}

User Question: ${message}

Please provide a helpful, concise response focusing on data analysis and insights. If the user has data loaded, reference specific aspects of their data in your response.
`;

    // Generate response
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    res.json({
      success: true,
      message: text,
      timestamp: new Date()
    });

  } catch (error) {
    console.error('AI Chat Error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get AI response',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
});

// Get AI insights for uploaded data
router.post('/insights', protect, async (req, res) => {
  try {
    const { dataId } = req.body;

    if (!dataId) {
      return res.status(400).json({
        success: false,
        message: 'Data ID is required'
      });
    }

    const data = await Data.findById(dataId);
    if (!data) {
      return res.status(404).json({
        success: false,
        message: 'Data not found'
      });
    }

    // Create the model
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    // Create insights prompt
    const prompt = `
Analyze this Excel data and provide key insights:

File: ${data.filename}
Data Structure: ${JSON.stringify(data.data.slice(0, 10), null, 2)}
Total Records: ${data.data.length}

Please provide:
1. Summary of the data
2. Key patterns or trends
3. Potential insights or recommendations
4. Any data quality observations

Keep the response concise but informative.
`;

    // Generate insights
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    res.json({
      success: true,
      insights: text,
      dataSummary: {
        filename: data.filename,
        totalRecords: data.data.length,
        columns: Object.keys(data.data[0] || {})
      },
      timestamp: new Date()
    });

  } catch (error) {
    console.error('AI Insights Error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to generate insights',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
});

module.exports = router;
