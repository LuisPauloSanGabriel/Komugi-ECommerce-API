const express = require('express')
const userController = require('../controllers/users')
const productController = require('../controllers/products')
const cartController = require('../controllers/cart')
const {verify, verifyAdmin} = require('../auth')

const router = express.Router()

// [SECTION] Route for retrieve user's cart
router.get("/get-cart", verify, cartController.getCart);

// [SECTION] Route for add to cart
router.post("/add-to-cart", verify, cartController.addToCart);


//Update Quantity for Products in Cart
router.patch("/update-cart-quantity", verify, cartController.updateQuantity)


////////////////////s54 Cart Workflow

//Remove from Cart
router.patch("/:productId/remove-from-cart", verify, cartController.removeFromCart)


//Clear Cart
router.put("/clear-cart", verify, cartController.clearCart)



module.exports = router

