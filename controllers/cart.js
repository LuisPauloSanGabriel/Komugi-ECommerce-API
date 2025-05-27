const mongoose = require('mongoose')
const Cart = require('../models/Cart')
const Product = require('../models/Product')
const User = require('../models/User')
const auth = require('../auth')
const { errorHandler } = require('../auth')


// [SECTION] Retrieve user's cart
module.exports.getCart = (req, res) => {
  const userId = req.user.id; 

  Cart.findOne({ userId: userId })
    .then((cart) => {
      if (!cart) {
        return res.status(404).send({ message: 'Cart not found' });
      }

      res.status(200).send(cart);
    })
    .catch(error => errorHandler (error, req, res))
};


// [SECTION] Add to cart
module.exports.addToCart = (req, res) => {
  	

  	if(!req.user.id) {
  			res.status(401).send({ message: "Unauthorized access"})
  	}

  	return Cart.findOne({userId: req.user.id}).then(cart => {
  	if(!cart) {
	  	let newCart = new Cart({
	  		userId: req.user.id,
	  		cartItems: [
	  				{
	  					productId: req.body.productId,
	  					quantity: req.body.quantity,
	  					subtotal: req.body.subtotal
	  				},
	  		],

	  		totalPrice: req.body.subtotal 
	  	})

	  	return newCart.save().then(savedCart => {
                    return res.status(201).send({ message: "Item added to cart successfully", cart: savedCart });
                }).catch(error => errorHandler(error, req, res));
  			

  		} else {
  			let itemIndex = cart.cartItems.findIndex(item => item.product === req.body.productId);

            if(itemIndex > -1) {
                let productItem = cart.cartItems[itemIndex];
                productItem.quantity += req.body.quantity;
                productItem.subtotal = productItem.quantity * req.body.subtotal;
                cart.totalPrice = cart.cartItems.reduce((sum, item) => sum + item.subtotal, 0);
            } else {
                cart.cartItems.push({
                    productId: req.body.productId,
                    quantity: req.body.quantity,
                    subtotal: req.body.subtotal
                });
                cart.totalPrice = cart.cartItems.reduce((sum, item) => sum + item.subtotal, 0);
            }

            cart.save()
                .then(updatedCart => {
                    return res.status(200).send({ message: "Successful", cart: updatedCart });
                })
                .catch(error => errorHandler(error, req, res));
        }
    })
    .catch(error => errorHandler(error, req, res));     
};



// Update Item Quantity
module.exports.updateQuantity = (req , res) => {


	let updatedQuantity = {
		quantity: req.body.quantity,
		subtotal: req.body.subtotal
	}

	if(!req.user.id) {
		return res.status(401).send({
			message: "Unauthorized access"
	})
	} else {
		return Cart.findOne({userId: req.user.id})
		.then(cart => {
			if(!cart) {
				return res.status(404).send({ message: "No cart found"})
			} else {

				let product = cart.cartItems.find(item => item.productId === req.body.productId)

				if(product) {
					product.quantity = req.body.quantity;
					product.subtotal = req.body.subtotal;

					const newTotalPrice = cart.cartItems.reduce((total, item) => total + item.subtotal, 0)
					cart.totalPrice = newTotalPrice


					return cart.save().then(updatedCart => {
						res.status(200).send({
							message: "Item quantity updated successfully",
							updatedCart: updatedCart
						})
					}).catch(error => errorHandler(error, req, res))
				} else {
					res.status(404).send({ message: "Item not found"})
				}
			}
		}).catch(error => errorHandler (error, req, res))
	}
}



/////////////////s54 Cart Workflow

//Remove from Cart
module.exports.removeFromCart = (req, res) => {
    if (!req.user.id) {
        return res.status(401).send({
            message: "Unauthorized",
            details: "User ID is missing.",
        });
    }

    // Find the cart by user ID and check if the product exists in the cart items
    Cart.findOne({ userId: req.user.id }) 
        .then(cart => {
            if (!cart) {
                return res.status(404).send({ message: "Cart not found" });
            }

            const productIndex = cart.cartItems.findIndex(item => item.productId === req.params.productId);

            if (productIndex !== -1) {
                cart.cartItems.splice(productIndex, 1);

                const newTotalPrice = cart.cartItems.reduce((total, item) => total + item.subtotal, 0);
                cart.totalPrice = newTotalPrice;

                return cart.save()
                    .then(updatedCart => {
                        res.status(200).send({
                            message: "Item removed successfully",
                            updatedCart: updatedCart
                        });
                    })
                    .catch(error => { errorHandler(error, req, res) });
            } else {
                return res.status(404).send({ message: "Item not found in cart" });
            }
        })
        .catch(error => { errorHandler(error, req, res) });
};


//Clear Cart

module.exports.clearCart = (req, res) => {
    if (!req.user.id) {
        return res.status(401).send({
            message: "Unauthorized",
            details: "User ID is missing.",
        });
    }

    Cart.findOne({ userId: req.user.id })
        .then(cart => {
            if (!cart) {
                return res.status(404).send({ message: "Cart not found" });
            }

            cart.cartItems = [];
            cart.totalPrice = 0;

            return cart.save()
                .then(updatedCart => {
                    res.status(200).send({
                        message: "Cart cleared successfully",
                        cart: updatedCart
                    });
                })
                .catch(error => {
                    console.error('Error in saving updated cart:', error);
                    res.status(500).send({ message: "Internal server error" });
                });
        })
        .catch(error => {
            console.error('Error in finding cart:', error);
            res.status(500).send({ message: "Internal server error" });
        });
};