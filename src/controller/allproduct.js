const Product = require("../models/product");
const shortid = require("shortid");
const slugify = require("slugify");
const Category = require("../models/category");


exports.getAllProducts = (req, res) => {
    console.log("getAllProducts");
    Product.find()
      .select("_id createdBy name price quantity slug description productPictures category productStatus") // Select specific fields to retrieve
      .exec((error, products) => {
        if (error) return res.status(400).json({ error });
        if (products) {
          res.status(200).json({ products });
        }
      });
  };
  