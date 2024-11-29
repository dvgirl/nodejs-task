const mongoose = require('mongoose');

const ratingSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  rating: {
    type: Number,
    required: true,
    min: 1, 
    max: 5,
  },
}, {
  timestamps: true,
});

const Rating = new mongoose.model("Rating", ratingSchema)
module.exports = Rating