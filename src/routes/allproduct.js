const express = require("express");
const { requireSignin, adminMiddleware } = require("../common-middleware");
const { getAllProducts,createProduct, getProductsBySlug, getProductDetailsById, deleteProductById, getProducts, updateProductStatus, rating, review } = require("../controller/product");
// const { addCategory, getCategories } = require('../controller/category');
const multer = require("multer");
const path = require("path");

const router = express.Router();
const shortid = require("shortid");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(path.dirname(__dirname), "uploads"));
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, shortid.generate() + "-" + file.originalname);
  },
});

const upload = multer({ storage });


router.get("/allproduct/getAllProducts",getAllProducts)


module.exports = router;
