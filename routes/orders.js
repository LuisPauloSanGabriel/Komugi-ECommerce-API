const express = require('express')
const orderController = require('../controllers/orders')
const { verify, verifyAdmin } = require('../auth')


const router = express.Router()

//Routes for checkout
router.post("/checkout", verify, orderController.checkOut)


//Routes for retrieving
//router.get("/my-orders", verify, orderController.myOrders)


//Routes for retrieving all orders as an admin
// router.get("/all-orders", verify, verifyAdmin, orderController.getAllOrders)

//[SECTION] Route for retrieving logged in user's orders.
router.get("/my-orders", verify, orderController.getUserOrder)

//[SECTION] Route for retrieving all user's orders.
router.get("/all-orders", verify, verifyAdmin, orderController.getAllOrders)

module.exports = router