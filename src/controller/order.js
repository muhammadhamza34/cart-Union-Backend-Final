const Order = require("../models/order");
const Cart = require("../models/cart");
const Address = require("../models/address");

exports.addOrder = (req, res) => {
  Cart.deleteOne({ user: req.user._id }).exec((error, result) => {
    if (error) return res.status(400).json({ error });
    if (result) {
      req.body.user = req.user._id;
      req.body.orderStatus = [
        {
          type: "ordered",
          date: new Date(),
          isCompleted: true,
        },
        {
          type: "packed",
          isCompleted: false,
        },
        {
          type: "shipped",
          isCompleted: false,
        },
        {
          type: "delivered",
          isCompleted: false,
        },
      ];
      const order = new Order(req.body);
      order.save((error, order) => {
        if (error) return res.status(400).json({ error });
        if (order) {
          res.status(201).json({ order });
        }
      });
    }
  });
};

exports.updaterefundOrders = async (req, res) => {
  console.log("updaterefundOrders")
  const itemId = req.body.itemid
  const refund = req.body.refund
  const buyername = req.body.buyername
  const orderId = req.body.orderid
  try {
    const order = await Order.findById(orderId);
    if (!order) {
      console.log('Order not found');
      res.status(200).json('Order not found');
      return;
    }

    const itemToUpdate = order.items.find(item => item._id.toString() === itemId);
    if (!itemToUpdate) {
      console.log('Item not found in the order');
      res.status(200).json('Item not found in the order');
      return;
    }

    itemToUpdate.returnItem = refund;
    itemToUpdate.buyername = buyername;
    await order.save();
    console.log('Refund status updated successfully');
    res.status(200).json('Refund status updated successfully');
  } catch (error) {
    console.error('Error updating refund status:', error);
    res.status(200).json('Error updating refund status:', error);
  }

};
exports.getOrders = (req, res) => {
  console.log("getOrders")
  Order.find({ user: req.user._id })
    .select("_id paymentStatus paymentType orderStatus items")
    .populate("items.productId", "_id name productPictures sellerId returnItem buyername ")
    .exec((error, orders) => {
      if (error) return res.status(400).json({ error });
      if (orders) {
        res.status(200).json({ orders });
      }
    });
};


exports.getAllOrders = (req, res) => {
  console.log("getAllOrders");
  Order.find()
    .select("_id user paymentStatus paymentType orderStatus items") // Select specific fields to retrieve
    .populate("items.productId", "_id name productPictures sellerId returnItem buyername")
    .exec((error, orders) => {
      if (error) return res.status(400).json({ error });
      if (orders) {
        res.status(200).json({ orders });
      }
    });
};

exports.getOrders1 = (req, res) => {
  Order.find({ user: req.user._id })
    .select("_id paymentStatus paymentType orderStatus items")
    .populate("items.productId", "_id name productPictures sellerId returnItem buyername")
    .exec((error, orders) => {
      if (error) return res.status(400).json({ error });
      if (orders) {
        console.log('orders')
        console.log(orders)
        var data={}
        for(var i=0;i<orders.length;i++){
          var username = orders[i]["user"]
          data[username]={}
          console.log(username)
        }
        res.status(200).json({ data });
      }
    });
};




exports.getOrder = (req, res) => {
  Order.findOne({ _id: req.body.orderId })
    .populate("items.productId", "_id name productPictures")
    .lean()
    .exec((error, order) => {
      if (error) return res.status(400).json({ error });
      if (order) {
        Address.findOne({
          user: req.user._id,
        }).exec((error, address) => {
          if (error) return res.status(400).json({ error });
          order.address = address.address.find(
            (adr) => adr._id.toString() == order.addressId.toString()
          );
          res.status(200).json({
            order,
          });
        });
      }
    });
};
