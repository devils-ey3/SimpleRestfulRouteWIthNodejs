const express = require('express');
const router = express.Router();

router.get('/',(req,res,next) => {
     res.status(200).json({
         message:"THis is a get request"
     });
})

router.post('/',(req,res,next) => {
     res.status(200).json({
         message:"THis is a post request"
     });
})

router.patch('/:productID',(req,res,next) => {
     res.status(200).json({
         message:"Update product"
     });
})

router.delete('/:productID',(req,res,next) => {
     res.status(200).json({
         message:"Delete product"
     });
})


router.get('/:productID',(req,res,next) => {
     let id = req.params.productID;

})    




module.exports = router;