import Product from "../Models/product.js";
import { isValidObjectId } from "mongoose";

const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"];

const MAX_IMAGE_BYTES = 2 * 1024 * 1024;

const validateImage = (image) => {
  if (typeof image !== "string") {
    return false;
  }

  const match = image.match(
    /^data:(image\/(?:jpeg|png|webp));base64,([A-Za-z0-9+/]+={0,2})$/,
  );

  if (!match) return false;

  const [, mimeType, base64] = match;

  if (!ALLOWED_IMAGE_TYPES.includes(mimeType)) {
    return false;
  }

  const buffer = Buffer.from(base64, "base64");

  if (buffer.length === 0 || buffer.length > MAX_IMAGE_BYTES) {
    return false;
  }

  const signatures = {
    "image/jpeg":
      buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff,

    "image/png": buffer
      .subarray(0, 8)
      .equals(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10])),

    "image/webp":
      buffer.toString("ascii", 0, 4) === "RIFF" &&
      buffer.toString("ascii", 8, 12) === "WEBP",
  };

  return Boolean(signatures[mimeType]);
};

const validateProduct = (product) => {
  if (!product || typeof product.name !== "string" || !product.name.trim()) {
    return "Product name is required";
  }

  if (
    product.price === "" ||
    product.price === null ||
    product.price === undefined ||
    !Number.isFinite(Number(product.price)) ||
    Number(product.price) <= 0
  ) {
    return "Product price must be greater than zero";
  }

  if (!validateImage(product.image)) {
    return "Invalid image. Upload a JPG, PNG or WebP up to 2 MB";
  }

  return null;
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

    const newProduct = await Product.create({
      name: name.trim(),
      price: Number(price),
      image,
    });

    return res.status(201).json({
      sucess: true,
      message: "Product created successfully",
      data: newProduct,
    });
  } catch (error) {
    console.error("Create product error:", error.message);

    return res.status(500).json({
      sucess: false,
      message: "Could not create product",
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
