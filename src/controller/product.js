const Product = require("../models/product");
const shortid = require("shortid");
const slugify = require("slugify");
const Category = require("../models/category");

exports.createProduct = (req, res) => {
  const {
    name,
    price,
    description,
    category,
    quantity,
    discountOnQuantity,
    discountPercentage,
    createdBy,
  } = req.body;

  let productPictures = [];

  if (req.files.length > 0) {
    productPictures = req.files.map((file) => {
      return { img: file.filename };
    });
  }
  const productStatus = "waiting";
  const review  = []
  const product = new Product({
    name: name,
    slug: slugify(name),
    price,
    quantity,
    description,
    discountOnQuantity,
    discountPercentage,
    productPictures,
    productStatus,
    review,
    category,
    createdBy: req.user._id,
  });
  product.save((error, product) => {
    if (error) return res.status(400).json({ error });
    if (product) {
      return res.status(201).json({ product });
    }
  });
};

// exports.getProductsBySlug = (req, res) => {
//   const { slug } = req.params;
//   Category.findOne({ slug: slug })
//     .select("_id type")
//     .exec((error, category) => {
//       if (error) {
//         return res.status(400).json({ error });
//       }

//       if (category) {
//         Product.find({ category: category._id }).exec((error, products) => {
//           if (error) {
//             return res.status(400).json({ error });
//           }

//           if (category.type) {
//             if (products.length > 0 && products.length < 8) {
//               res.status(200).json({
//                 products,
//                 priceRange: [
//                   (under5k = 5000),
//                   (under10k = 10000),
//                   (under15k = 15000),
//                   (under20k = 20000),
//                   (under30k = 30000),
//                   (under50k = 50000),
//                   (under100K = 100000),
//                 ],

//                 productsByPrice: [
//                   (under5K = products.filter(
//                     (product) => product.price <= 5000
//                   )),
//                   (under10K = products.filter(
//                     (product) => product.price > 5000 && product.price <= 10000
//                   )),
//                   (under15K = products.filter(
//                     (product) => product.price > 10000 && product.price <= 15000
//                   )),
//                   (under20K = products.filter(
//                     (product) => product.price > 15000 && product.price <= 20000
//                   )),
//                   (under25K = products.filter(
//                     (product) => product.price > 20000 && product.price <= 25000
//                   )),
//                   (under30K = products.filter(
//                     (product) => product.price > 25000 && product.price <= 30000
//                   )),
//                   (under50K = products.filter(
//                     (product) => product.price > 30000 && product.price <= 50000
//                   )),
//                   (under100K = products.filter(
//                     (product) =>
//                       product.price > 50000 && product.price <= 100000
//                   )),
//                 ],
//               });
//             }
//           } else {
//             res.status(200).json({ products });
//           }
//         });
//       }
//     });
// };
exports.getProductsBySlug = (req, res) => {
  const { slug } = req.params;
  Category.findOne({ slug: slug })
    .select("_id type")
    .exec((error, category) => {
      if (error) {
        return res.status(400).json({ error });
      }

      if (category) {
        Product.find({ category: category._id }).exec((error, products) => {
          if (error) {
            return res.status(400).json({ error });
          }

          if (category.type) {
            let priceRange = [];
            let productsByPrice = [];

            // Group products by price range
            products.forEach((product) => {
              let added = false;
              for (let i = 0; i < priceRange.length; i++) {
                if (product.price <= priceRange[i]) {
                  productsByPrice[i].push(product);
                  added = true;
                  break;
                }
              }
              if (!added) {
                priceRange.push(product.price);
                productsByPrice.push([product]);
              }
            });

         
            res.status(200).json({
              products,
              priceRange,
              productsByPrice,
            });
            
          } else {
            res.status(200).json({ products });
          }
        });
      }
    });
};

exports.getProductDetailsById = (req, res) => {
  const { productId } = req.params;
  if (productId) {
    Product.findOne({ _id: productId })
    .populate({ path: "createdBy", select: "_id email contactNumber" })
    .exec((error, product) => {
      if (error) return res.status(400).json({ error });
      if (product) {
        res.status(200).json({ product });
      }
    });
  } else {
    return res.status(400).json({ error: "Params required" });
  }
};

exports.deleteProductById = (req, res) => {
  const { productId } = req.body.payload;
  if (productId) {
    Product.deleteOne({ _id: productId }).exec((error, result) => {
      if (error) return res.status(400).json({ error });
      if (result) {
        res.status(202).json({ result });
      }
    });
  } else {
    res.status(400).json({ error: "Params required" });
  }
};

exports.getProducts = async (req, res) => {
  const products = await Product.find({ createdBy: req.user._id })
    .select(
      "_id createdBy name price quantity slug description productPictures category productStatus totalrating totalreview ratings"
    )
    .populate({ path: "category", select: "_id name" })
    // .populate({ path: "products", select: "createdBy" })
    .exec();

  res.status(200).json({ products });
};


exports.getAllProducts = (req, res) => {
  console.log("getAllProducts");
  Product.find()
    .select("_id createdBy name price quantity slug description productPictures category productStatus totalrating totalreview ratings") // Select specific fields to retrieve
    .exec((error, products) => {
      if (error) return res.status(400).json({ error });
      if (products) {
        res.status(200).json({ products });
      }
    });
};

exports.getAllProductsdata = async (req, res) => {
  try {
    const { productId } = req.params; // Assuming the productId is provided as a parameter


    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    const items = product.productPictures.map(picture => picture.img);

    res.status(200).json(items);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
    
};

exports.getAllProductsdatamenu = async (req, res) => {
  try {
    console.log("getAllProductsdatamenu")
    const product = await Product.find();
    res.status(200).json({data:product});
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
    
};

exports.updateProductStatus = (req, res) => {
  const productId = req.params.productId;
  const newProductStatus = req.body.productStatus;
  Product.updateOne(
    { _id: productId },
    { $set: { productStatus: newProductStatus } }
  )
    .then((result) => {
      // console.log(`Product ${productId} status updated. Result: `, result);
      // console.log("prodcutStatus :",newProductStatus)
      if (result.nModified === 0) {
        res.status(404).json({ message: `Product ${productId} not found.` });
      } else {
        res
          .status(200)
          .json({ message: "Product status updated successfully." });
      }
    })
    .catch((error) => {
      console.error(error);
      res.status(500).json({ error: error.message });
    });
};



// ***********************************************************************************************

exports.rating = async (req, res) => {
  const { _id } = req.user;
  const { star, prodId , review,username, } = req.body;
  try {
    console.log('req.body')
    console.log(req.body)
    const product = await Product.findById(prodId);
    // return res.status(404).json({ error: req.body });
   
    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }
    const alreadyReviewed =""; 

    if(review == "" && star == 0){
      return res.json({ message: "Product rating not added" });
    }

    
    if (review!=""){
      console.log(review)
      if (product.reviews && Array.isArray(product.reviews)) {
        alreadyReviewed = product.reviews.find(
          (review) => review.postedBy.toString() === _id.toString()
        );
      }
      if (alreadyReviewed!="") {
        const newTotalreview = product.totalreview + 1;
        product.totalreview = newTotalreview;
        // Save the updated product document
        const updatedProduct = await product.save();

        const updateReview = await Product.updateOne(
          {
            review: { $elemMatch: alreadyReviewed },
          },
          {
            $set: { "review.$.reviews": review },
          }
        );
    
        if (!updateReview) {
          return res.status(500).json({ error: "Failed to update review" });
        }
    
        // return res.json(updateReview);
      } else {

        product.reviews = [];

        const newTotalreview = product.totalreview + 1;
        product.totalreview = newTotalreview;

        let productPictures = [];

        if (req.files.length > 0) {
          productPictures = req.files.map((file) => {
            return { img: file.filename };
          });
        }
        // return res.status(500).json({ error: productPictures});
        // Save the updated product document
        const updatedProduct = await product.save();
        const addReview = await Product.findByIdAndUpdate(
          prodId,
          {
            $push: {
              review: {
                username: username,
                star:star,
                productPictures:productPictures,
                reviews: review,
                postedBy: _id,
              },
              $inc: { totalreview: 1 },
            },
          }
        );

        // return res.status(500).json({ error: addReview});
    
        if (!addReview) {
          return res.status(500).json({ error: "Failed to add review" });
        }
      }
    }


    if(star>0){
      let alreadyRated = product.ratings.find(
        (userId) => userId.postedby.toString() === _id.toString()
      );

      if (alreadyRated) {
      
        const totalrating = product.totalrating || 0;
        const newTotalRating = totalrating + 1;
        
        // Find the index of the existing rating in the ratings array
        const ratingIndex = product.ratings.findIndex(rating => rating.postedby === _id);
        const calrating = ((star + product.ratings[0]['star']) / 2);
        // Update the specific rating object in the ratings array
        // return res.json({ message: calrating});
        product.ratings[0]['star'] = calrating;
        product.totalrating = newTotalRating;
        // Save the updated product document
        const updatedProduct = await product.save();

        return res.json({ message: "Product rating successfully" });

      } else {
        try {
          const rateProduct = await Product.findByIdAndUpdate(
            prodId,
            {
              $push: {
                ratings: {
                  star: star,
                  postedby: _id,
                },
              },
              $inc: { totalrating: 1 },
            },
            { new: true } // Return the updated document
          );
      
          if (!rateProduct) {
            return res.status(500).json({ error: "Failed to rate the product" });
          }
      
          return res.json({ message: "Product rating successfully" });
        } catch (error1) {
          console.error(error1);
        return res.status(500).json({ error:  "test2" });
        }
      }
    }
    else{
      return res.status(500).json({ error: "star is not detect" });
    }
  
  } catch (error1) {
    console.error(error1);
    return res.status(500).json({ error: "test1" });
  }
};


exports.review = async (req, res) => {
  const { _id } = req.user;
  const { review, prodId } = req.body;

  try {
    const product = await Product.findById(prodId);
   
    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    let alreadyReviewed = product.reviews.find(
      (userId) => userId.postedBy.toString() === _id.toString()
    );

    if (alreadyReviewed) {
      const updateReview = await Product.updateOne(
        {
          reviews: { $elemMatch: alreadyReviewed },
        },
        {
          $set: { "reviews.$.review": review },
        }
      );

      if (!updateReview) {
        return res.status(500).json({ error: "Failed to update review" });
      }

      return res.json(updateReview);
    } else {
      const addReview = await Product.findByIdAndUpdate(
        prodId,
        {
          $push: {
            reviews: {
              review: review,
              postedBy: _id,
            },
          },
        }
      );

      if (!addReview) {
        return res.status(500).json({ error: "Failed to add review" });
      }

      return res.json(addReview);
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};



// ***********************************************************************************************