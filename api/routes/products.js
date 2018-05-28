const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const productModel = require('../models/products');

// for image upload
const multer = require('multer');
const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, './uploads/');
  },
  filename: (req, file, callback) => {
    callback(null, new Date().toISOString() + file.originalname);
  }
})

const fileFilter = (req, file, callback) => {
  if (['image/jpeg','image/jpg', 'image/png'].includes(file.mimetype)) {
    // reject 
    callback(null, true); 
  } else {
    // accept file
    callback(new Error('Invalid file'), false);
  }

}

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 1024 * 1024 * 5
  },
  fileFilter:fileFilter
});


router.get('/', (req, res, next) => {
  productModel.find()
    .select('_id name price productImage')
    .exec()
    .then((result) => {
      if (result.length > 0) {
        const product = {
          count: result.length,
          products: result.map((item) => {
            return {
              name: item.name,
              price: item.price,
              productImage: item.productImage,
              request: {
                type: "GET",
                url: "http://localhost:3000" + "/products/" + item._id
              }
            }
          })
        };

        res.status(200).json(product);
      } else {
        res.status(404).json({
          message: "No productfound"
        })
      }
    }).catch((err) => {
      res.status(500).json({
        err
      });
    });
})

router.post('/', upload.single('productImage'), (req, res, next) => {

  const product = new productModel({
    _id: new mongoose.Types.ObjectId(),
    name: req.body.name,
    price: req.body.price,
    productImage: req.file.path
  })

  product.save().then((result) => {
    res.status(200).json({
      message: "Successfully added",
      name: result.name,
      price: result.price,
      _id: result._id,
      productImage:result.productImage,
      request: {
        type: 'GET',
        url: "http://localhost:3000/products/" + result._id
      }
    });
  }).catch((err) => {
    res.status(500).json({
      err
    });
  });

})

router.patch('/:productID', (req, res, next) => {

  productModel.findByIdAndUpdate(req.params.productID, req.body).exec().then((result) => {
    if (result) {
      res.status(200).json({
        result,
        message: "Updated"
      });
    } else {
      res.status(404).json({
        message: "Invalid id"
      })
    }
  }).catch((err) => {
    res.status(500).json({
      err
    });
  });
})

router.delete('/:productID', (req, res, next) => {
  productModel.findByIdAndRemove(req.params.productID).exec().then((result) => {
    if (result) {
      res.status(200).json({
        result,
        message: "Deleted"
      });
    } else {
      res.status(404).json({
        message: "Invalid Id"
      })
    }
  }).catch((err) => {
    res.status(500).json({
      err
    });
  });
})

router.get('/:productID', (req, res, next) => {
  let id = req.params.productID;
  productModel.findById(req.params.productID).then((result) => {
    if (result)
      res.status(200).json({
        result
      });
    else
      res.status(404).json({
        message: "Id not found"
      });
  }).catch((err) => {
    res.status(500).json({
      err
    });
  });

})


module.exports = router;