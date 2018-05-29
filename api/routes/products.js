const express = require('express');
const router = express.Router();
const checkauth = require('../middleware/authChecker');
const productController = require('../controllers/products');
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
  if (['image/jpeg', 'image/jpg', 'image/png'].includes(file.mimetype)) {
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
  fileFilter: fileFilter
});


router.get('/', productController.products_get_all);

router.post('/' , checkauth ,upload.single('productImage') , productController.product_post);

router.patch('/:productID',checkauth ,productController.product_upgrade );

router.delete('/:productID',checkauth, productController.product_remove);

router.get('/:productID', productController.product_get_by_id);


module.exports = router;