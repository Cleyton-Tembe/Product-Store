import { Router } from "express";
import Product from "../Models/product.js";
import mongoose, { isValidObjectId } from "mongoose";


const getAll = async (req, res) => {
    
    try {
        const allproducts = await Product.find({})
        res.status(200).json({sucess: true, message: 'Found All Products', data: allproducts})
    } catch (error) {
        console.error("Error", error.message)
        res.status(400).json({sucess: false, message: 'Could not find products'})
    }
}

const addProduct = async (req, res) => {
    console.log("Just arrived here")
    const product = req.body;
    console.log(req.body)
    if(!product.name || !product.price || !product.image) {

        res.json({message:'Could not create product', sucess: false}).status(400)

    }

    const newProducts = new Product(product)

    try{
        await newProducts.save()
        res.json({sucess: true, data: newProducts}).status(201)
    }
    catch(e) {
        console.error("ERROR", e.message)
        res.json({sucess: false, message: "something went wrong"}).status(500)
    }

}

const updateProduct = async (req, res) => {
    const id = req.params.id
    const update = req.body;
    console.log("Just arrived here")

    console.log(req.body)
    if(!mongoose.Types.ObjectId.isValid(id) && !update.name && !update.price && !update.image) {
        res.status(400).json({sucess: false, message:"Could not find Product"})
    }

    try {
       
        const product = await Product.findByIdAndUpdate(id, update, {new:true});
        res.status(201).json({sucess: true, message:'Updated with sucess', data: product})

    }catch(e) {
        console.error("error", e.message)
        res.status(500).json({message:"Something went wrong"})
    }
}


const deleteProduct = async (req, res) => {
    const id = req.params.id;

    if(!id && !mongoose.Types.ObjectId.isValid(id)) {    
        res.json({sucess: false, message: 'Could not find user'}).status(400)
    }

    try {
        await Product.findByIdAndDelete(id);
        res.status(201).json({sucess: true, message : "deleted with sucess"})
    }
    catch(e){
        console.error("Error", e.message)
        res.status(500).json({message:"Something went wrong"})
    }

    
}

export {getAll, addProduct, updateProduct, deleteProduct}