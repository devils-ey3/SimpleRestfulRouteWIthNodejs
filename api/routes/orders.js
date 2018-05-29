const express = require('express');
const router = express.Router();
const checkauth = require('../middleware/authChecker');


const OrderControllers = require('../controllers/orders');

router.get("/", checkauth,OrderControllers.order_get_all);

router.post('/',checkauth, OrderControllers.order_post);


router.get("/:orderId", OrderControllers.order_get_by_id);

router.delete("/:orderId", checkauth,OrderControllers.order_delete_by_id);


module.exports = router;