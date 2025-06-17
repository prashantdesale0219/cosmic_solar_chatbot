const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  _id: {
    type: String,
    default: () => `prod${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}`
  },
  name: {
    type: String,
    required: [true, 'Please add a product name']
  },
  type: {
    type: String,
    required: [true, 'Please add a product type']
  },
  watt: {
    type: Number,
    required: [true, 'Please add wattage']
  },
  price: {
    type: Number,
    required: [true, 'Please add price']
  },
  stock: {
    type: Number,
    required: [true, 'Please add stock quantity']
  },
  features: {
    type: [String],
    default: []
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Product', productSchema, 'products');