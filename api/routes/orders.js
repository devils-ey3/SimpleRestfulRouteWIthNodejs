const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const orderModel = require('../models/orders');
const productModel = require('../models/products');

router.get("/", (req, res, next) => {

  orderModel.find()
    .select("product quantity _id")
    .populate("product",'name -_id')
    .exec()
    .then(docs => {
      res.status(200).json({
        count: docs.length,
        orders: docs.map(doc => {
          return {
            _id: doc._id,
            product: doc.product,
            quantity: doc.quantity,
            request: {
              type: "GET",
              url: "http://localhost:3000/orders/" + doc._id
            }
          };
        })
      });
    })
    .catch(err => {
      res.status(500).json({
        error: err
      });
    });

});

router.post('/', (req, res, next) => {

  const productID = req.body.productID;
  productModel.findById(productID).then((product) => {
    if (!product) {
      return res.status(404).json({
        message: "Product not found"
      });
    }
    const order = new orderModel({
      _id: new mongoose.Types.ObjectId(),
      product: productID,
      quantity: req.body.quantity,
    })

    order.save().then((result) => {
      res.status(201).json({
        message: "Order stored",
        createdOrder: {
          _id: result._id,
          product: result.product,
          quantity: result.quantity
        },
        request: {
          type: "GET",
          url: "http://localhost:3000/orders/" + result._id
        }
      });
    })
  }).catch((err) => {
    res.status(500).json(err);
  });

})


router.get("/:orderId", (req, res, next) => {
  orderModel.findById(req.params.orderId)
    .select('-__v')
    .populate("product",'-__v')
    .exec()
    .then(order => {
      if (!order) {
        return res.status(404).json({
          message: "Order not found"
        });
      }
      res.status(200).json({
        order: order,
        request: {
          type: "GET",
          url: "http://localhost:3000/orders"
        }
      });
    })
    .catch(err => {
      res.status(500).json({
        error: err
      });
    });
});

router.delete("/:orderId", (req, res, next) => {
  orderModel.findByIdAndRemove(req.params.orderId)
    .exec()
    .then(result => {
      res.status(200).json({
        message: "Order deleted",
        request: {
          type: "POST",
          url: "http://localhost:3000/orders",
          body: {
            productId: "ID",
            quantity: "Number"
          }
        }
      });
    })
    .catch(err => {
      res.status(500).json({
        error: err
      });
    });
});


module.exports = router;