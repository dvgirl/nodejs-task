const express = require("express");   
const Product = require("../models/product-model");
const fs = require('fs');
const path = require('path');


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
        if (name) {
            obj.name = name;
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