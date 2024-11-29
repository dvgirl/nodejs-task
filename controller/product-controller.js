const express = require("express");   
const Product = require("../models/product-model");
const fs = require('fs');
const path = require('path');
const Joi = require('joi');

const mySchema = Joi.object({
    name: Joi.string().min(3).required(),
    price: Joi.number().min(0).required(),
    discount: Joi.number().min(0).max(100).required(),
    description:Joi.string().required()
});
exports.addProduct = async (req , res)=> {
    try{
        const { price, discount} = req.body;
        
        const { error } = mySchema.validate(req.body);
        if (error) {
            console.log(error)
          return res.status(400).json(error.message);
        }
        else {
        let totalPrice = price - (price * (discount / 100));
        const productData = new Product({
            ...req.body,
            image: req.file ? req.file.filename : null,
            totalPrice:totalPrice,
            createdBy: req.user._id,
        });
        const newProduct = await productData.save();
        res.status(201).json({ message: "OK",data: newProduct });
    }
    }
    catch(err){
        console.log(err)
        res.status(500).json({ message: err })
    }
}

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

  