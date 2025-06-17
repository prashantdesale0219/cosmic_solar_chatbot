const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const mistralService = require('../services/mistralService');

/**
 * @route   POST /api/ask
 * @desc    Process user question and return AI response
 * @access  Public
 */
router.post('/ask', async (req, res) => {
  try {
    // Validate request
    const { question, language = 'en' } = req.body;
    
    if (!question) {
      return res.status(400).json({ 
        success: false, 
        error: 'Question is required' 
      });
    }

    // Fetch all products from MongoDB
    const products = await Product.find({});
    
    if (!products || products.length === 0) {
      return res.status(404).json({ 
        success: false, 
        error: 'No products found in database' 
      });
    }

    // Generate response using Mistral AI
    const aiResponse = await mistralService.generateResponse(question, products, language);

    // Return the response
    return res.status(200).json({
      success: true,
      question,
      answer: aiResponse,
      productsCount: products.length,
      language
    });

  } catch (error) {
    console.error('Error processing question:', error.message);
    return res.status(500).json({ 
      success: false, 
      error: 'Server error processing your question' 
    });
  }
});

/**
 * @route   GET /api/health
 * @desc    Health check endpoint
 * @access  Public
 */
router.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', message: 'API is running' });
});

/**
 * @route   GET /api/products
 * @desc    Get all products
 * @access  Public
 */
router.get('/products', async (req, res) => {
  try {
    const products = await Product.find({});
    res.status(200).json({
      success: true,
      count: products.length,
      data: products
    });
  } catch (error) {
    console.error('Error fetching products:', error.message);
    res.status(500).json({
      success: false,
      error: 'Server error fetching products'
    });
  }
});

/**
 * @route   POST /api/products
 * @desc    Add a new product
 * @access  Public
 */
router.post('/products', async (req, res) => {
  try {
    const product = await Product.create(req.body);
    res.status(201).json({
      success: true,
      data: product
    });
  } catch (error) {
    console.error('Error adding product:', error.message);
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(val => val.message);
      return res.status(400).json({
        success: false,
        error: messages
      });
    } else {
      res.status(500).json({
        success: false,
        error: 'Server error adding product'
      });
    }
  }
});

module.exports = router;