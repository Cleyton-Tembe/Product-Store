import Product from "../Models/product.js";
import { isValidObjectId } from "mongoose";

const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"];

const MAX_IMAGE_BYTES = 2 * 1024 * 1024;
const MAX_IMAGE_SIZE = 2 * 1024 * 1024; // 2 MiB

const validateProductImage = (image) => {
  if (!image || typeof image !== "string") {
    return {
      valid: false,
      message: "Product image is required",
    };
  }

  const match = image.match(
    /^data:(image\/(?:jpeg|png|webp));base64,([A-Za-z0-9+/]+={0,2})$/,
  );

  if (!match) {
    return {
      valid: false,
      message: "Invalid image format. Use JPG, PNG or WebP.",
    };
  }

  const base64 = match[2];

  const imageSize = Buffer.byteLength(base64, "base64");

  if (imageSize > MAX_IMAGE_SIZE) {
    return {
      valid: false,
      message: "Image exceeds the 2 MB size limit.",
    };
  }

  if (imageSize === 0) {
    return {
      valid: false,
      message: "The selected image is empty.",
    };
  }

  return {
    valid: true,
    message: "Valid image",
  };
};

// GET ALL PRODUCTS
const getAll = async (req, res) => {
  try {
    const products = await Product.find({});
    return res.status(200).json({
      sucess: true,
      message: "Found all products",
      data: products,
    });
  } catch (error) {
    console.error("Get products error:", error.message);

    return res.status(500).json({
      sucess: false,
      message: "Could not fetch products",
    });
  }
};

// CREATE PRODUCT

const addProduct = async (req, res) => {
  try {
    const { name, price, image } = req.body ?? {};

    if (!name?.trim() || !price || !image) {
      return res.status(400).json({
        sucess: false,
        message: "Please fill all required fields.",
      });
    }

    const validation = validateProductImage(image);

    if (!validation.valid) {
      return res.status(400).json({
        sucess: false,
        message: validation.message,
      });
    }

    const product = await Product.create({
      name: name.trim(),
      price: Number(price),
      image,
    });

    return res.status(201).json({
      sucess: true,
      message: "Product created successfully",
      data: product,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      sucess: false,
      message: "Failed to create product.",
    });
  }
};

// UPDATE PRODUCT
const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      return res.status(400).json({
        sucess: false,
        message: "Invalid product ID",
      });
    }

    const { name, price, image } = req.body ?? {};

    const validationError = validateProduct({
      name,
      price,
      image,
    });

    if (validationError) {
      return res.status(400).json({
        sucess: false,
        message: validationError,
      });
    }

    const updatedProduct = await Product.findByIdAndUpdate(
      id,
      {
        name: name.trim(),
        price: Number(price),
        image,
      },
      {
        new: true,
        runValidators: true,
      },
    );

    if (!updatedProduct) {
      return res.status(404).json({
        sucess: false,
        message: "Product not found",
      });
    }

    return res.status(200).json({
      sucess: true,
      message: "Product updated successfully",
      data: updatedProduct,
    });
  } catch (error) {
    console.error("Update product error:", error.message);

    return res.status(500).json({
      sucess: false,
      message: "Could not update product",
    });
  }
};

// DELETE PRODUCT
const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      return res.status(400).json({
        sucess: false,
        message: "Invalid product ID",
      });
    }

    const deletedProduct = await Product.findByIdAndDelete(id);

    if (!deletedProduct) {
      return res.status(404).json({
        sucess: false,
        message: "Product not found",
      });
    }

    return res.status(200).json({
      sucess: true,
      message: "Product deleted successfully",
    });
  } catch (error) {
    console.error("Delete product error:", error.message);

    return res.status(500).json({
      sucess: false,
      message: "Could not delete product",
    });
  }
};

export { getAll, addProduct, updateProduct, deleteProduct };
