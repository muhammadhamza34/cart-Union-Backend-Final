const mongoose = require("mongoose");
const productSchema = new mongoose.Schema(
  {
    
    name: {
      type: String,
      required: true,
      trim: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
    },
    price: {
      type: Number,
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
    },
    count: {
      type: Number,
      default: 0,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    offer: { type: Number },
    productPictures: [{ img: { type: String } }],
    productStatus: {
      type: String,
      required: true,
      default: "waiting",
      trim: true,
    },
    ratings: [
      {
        star: Number,
        postedby: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
      },
    ],
    totalrating: {
      type: Number,
      default: 0,
    },
    totalreview: {
      type: Number,
      default: 0,
    },
    review: [{
      reviews: String,
      username: String,
      star: Number,
      productPictures: [{ img: { type: String } }],
      postedby: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    }],
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    discountOnQuantity: { type: Number, required: false },
    discountPercentage: { type: Number, required: false },
    updatedAt: Date,
  },
  { timestamps: true }
);

module.exports = mongoose.model("Product", productSchema);
