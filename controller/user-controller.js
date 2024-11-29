const express = require("express");   
const Product = require("../models/product-model");
const fs = require('fs');
const path = require('path');
const Rating = require("../models/rating-model");


exports.ProductList = async (req , res)=> {
    try{
        const { name , minPrice , maxPrice , discount ,page = 1, limit = 10} = req.query;
        const obj = {}   
        if (name) {
            obj.name = { $regex: name, $options: 'i' };
        }   
        const priceConditions = [];
        if (minPrice) {
            priceConditions.push({ price: { $gte: Number(minPrice) } });
        }
        if (maxPrice) {
            priceConditions.push({ price: { $lte: Number(maxPrice) } });
        } 
        if (priceConditions.length > 0) {
            obj.$and = priceConditions;
        }
        if (discount) {
            obj.discount = Number(discount);
        }
        if (name) {
            obj.name = name;
        }
        
        const skip = (page - 1) * limit;
        const totalItems = await Product.countDocuments(obj);
        const productList = await Product.find(obj).skip(skip).limit(limit);;
        res.json({ message: 'OK', 
            result: {
            totalItems,
            totalPages: Math.ceil(totalItems / limit),
            currentPage: page,
            limit,
          },
          data: productList})
    }
    catch(err){
        console.log(err)
        res.status(500).json({ message: err })
    }
} 
exports.addRating = async (req , res) => {
    try {
        const {product , user } = req.body
        const israting = await Rating.findOne({ product : product , user:user});
        console.log(israting)
        if(israting != null){
            return res.json({ message: "already added rating" })
        }
        else {
        const newRating = new Rating(req.body);
        const savedRating = await newRating.save();
        const ratings = await Rating.find({ product : product});
        const totalRatings = ratings.length;
        const sumRatings = ratings.reduce((sum, r) => sum + r.rating, 0);
        const averageRating = sumRatings / totalRatings;

        await Product.findOneAndUpdate({ _id : product } , {$set : {rating : averageRating}})
        
        return res.json({ message: savedRating})
        }

      } catch (err) {
        console.error('Error adding rating:', err.message);
      }  
}
exports.getItemRatings = async (req, res) => {
    try {
        const { minRating, maxRating, page = 1, limit = 10 } = req.query;

        const query = {};
        if (minRating || maxRating) {
            query.rating = {};
            if (minRating) query.rating.$gte = Number(minRating);
            if (maxRating) query.rating.$lte = Number(maxRating);
        }

        const skip = (Number(page) - 1) * Number(limit);
        const ratings = await Rating.find(query)
            .skip(skip)
            .limit(Number(limit))
            .populate('product', 'name') 
            .sort({ createdAt: -1 }); 

        const ratingStatus = await Rating.aggregate([
            { $match: query },
            {
                $group: {
                    _id: '$itemId',
                    averageRating: { $avg: '$rating' },
                    totalRatings: { $sum: 1 },
                    highestRating: { $max: '$rating' },
                    lowestRating: { $min: '$rating' },
                },
            },
        ]);

        res.status(200).json({
            message: 'OK',
            data: {
                result: ratingStatus,
                ratings,
            },
            pagination: {
                currentPage: Number(page),
                totalPages: Math.ceil(await Rating.countDocuments(query) / limit),
            },
            
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Internal server error.', error: err.message });
    }
};