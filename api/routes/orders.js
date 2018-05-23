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

router.patch('/:orderID',(req,res,next) => {
     res.status(200).json({
         message:"Update order"
     });
})

router.delete('/:orderID',(req,res,next) => {
     res.status(200).json({
         message:"Delete order"
     });
})


router.get('/:orderID',(req,res,next) => {
     let id = req.params.productID;

})    




module.exports = router;