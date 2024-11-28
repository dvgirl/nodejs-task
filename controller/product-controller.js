const express = require("express");   
const Product = require("../models/product-model");
const fs = require('fs');
const path = require('path');


exports.addProduct = async (req , res)=> {
    try{
        const { price, discount} = req.body;
        if (!price || price < 0) {
            return res.json({ message: "price not less then 0" });
        }
        if (discount < 0 || discount > 100) {
            return res.json({ message: "discount must be between 0 to 100" });
        } 
        let totalPrice = price - (price * (discount / 100));
        const productData = new Product({
            ...req.body,
            image: req.file.filename,
            totalPrice:totalPrice,
            createdBy: req.user._id,
        });
        const newProduct = await productData.save();
        res.status(201).json({ message: "OK",data: newProduct });
    }
    catch(err){
        console.log(err)
        res.status(500).json({ message: err })
    }
}

exports.ProductList = async (req , res)=> {
    try{
        const { name , minPrice , maxPrice , discount} = req.query;
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
        console.log(obj)
        const productList = await Product.find(obj);
        res.json({ message: 'OK', data: productList})
    }
    catch(err){
        console.log(err)
        res.status(500).json({ message: err })
    }
} 

exports.updateProduct = async (req , res)=> {
    try{
        const { id } = req.params;
        const productData = await Product.findOne({ _id : id })
    
        if(req.file && productData && productData.image != null && productData.image != ''){
            const filePath = 'uploadedfile/uploads/' + productData.image
                fs.access(filePath, fs.constants.F_OK, () => {
                    fs.unlink(filePath, () => {
                        console.log('File deleted successfully');
                    });
                });
                req.body.image = req.file.filename
        }
        req.body.totalPrice = req.body.price - (req.body.price * (req.body.discount / 100));
        const adminData = await Product.findOneAndUpdate({ _id : id } , {$set :req.body} , {new :true})
        res.json({ message: 'OK', data: adminData})
    }
    catch(err){
        console.log(err)
        res.status(500).json({ message: err })
    }
}

exports.deleteProduct = async ( req , res)=> {
    try{
        const { id } = req.params;
        const productData = await Product.findOne({ _id : id })
        if(productData && productData.image != null && productData.image != ''){
        const filePath = 'uploadedfile/uploads/' + productData.image
            fs.access(filePath, fs.constants.F_OK, () => {
                fs.unlink(filePath, () => {
                    console.log('File deleted successfully');
                });
            });
            await Product.findOneAndDelete({ _id : id })
        res.json({ message: 'product delete done'})
        }
        else{
            res.json({ message: 'please try again no data found'})
        }
        
    }
    catch(err){
        console.log(err)
        res.status(500).json({ message: err })
    } 
}

exports.getItemRatings = async (req, res) => {
    try {
        const { itemId, minRating, maxRating, page = 1, limit = 10 } = req.query;

        const query = {};
        if (itemId) {
            query.itemId = itemId;
        }
        if (minRating || maxRating) {
            query.rating = {};
            if (minRating) query.rating.$gte = Number(minRating);
            if (maxRating) query.rating.$lte = Number(maxRating);
        }


        const skip = (Number(page) - 1) * Number(limit);

        const ratings = await Rating.find(query)
            .skip(skip)
            .limit(Number(limit))
            .populate('itemId', 'name') 
            .sort({ createdAt: -1 }); 

        const ratingStats = await Rating.aggregate([
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
            message: 'Ratings retrieved successfully.',
            data: {
                ratings,
                statistics: ratingStats,
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