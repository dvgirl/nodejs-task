const mongoose = require('mongoose')

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true,
        min: 0,
    },
    totalPrice: {
        type: Number,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    image: {
        type: String,
        require: true
    },
    discount: {
        type: Number,
        default: 0,
        min: 0,
        max: 100
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


