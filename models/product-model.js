const mongoose = require('mongoose')
s
const productSchema = new mongoose.Schema({
    Name: {
        type: String,
    },
    price: {
        type: Number
    },
    description: {
        type: String,
        required: true,
    },
    Image: {
        type: String,
        require: true
    },
    discount: {
        type: Number,
        required: true,
    },
    rating: {
        type: Number,
        default: 0
    },
    createdBy:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"user"
    }
}, {
    timestamps: true,
  })

const Product = new mongoose.model("Product", productSchema)
module.exports = Product


