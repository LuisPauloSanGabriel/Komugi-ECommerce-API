const mongoose = require('mongoose')
const Order = require('../models/Order')
const Product = require('../models/Product')
const User = require('../models/User')
const Cart = require('../models/Cart')
const auth = require('../auth')
const { errorHandler } = ('../auth')


//Checkout Orders
module.exports.checkOut = (req , res) => {


	if(!req.user.id){
		res.status(401).send({ message: "Unauthorized access"})
	}


	return Cart.findOne({userId: req.user.id})
		   .then(cart => {

		   		if(!cart) {

		   			return res.status(404).send({ message: 'Cart not found' });

		   		}

	   			if(Array.isArray(cart.cartItems) && cart.cartItems.length > 0) {

	   				const orderDetails = cart.cartItems.map(item => ({
	   					productId: item.productId,
	   					quantity: item.quantity,
	   					subtotal: item.subtotal
	   				}))

	   				let newOrder = new Order({
	   					userId: req.user.id,
	   					productsOrdered: orderDetails,
	   					totalPrice: cart.totalPrice
	   				})

	   				return newOrder.save().then(orderCreated => {
	   					cart.cartItems = [];
	   					cart.totalPrice = 0;
	   					return cart.save().then(cartSaved => {
	   						res.status(201).send({ message: "Ordered Successfully"});
	   					});
	   				}).catch(error => errorHandler(error, req, res))

		   		} else {

		   				return res.status(400).send({ message: 'No Items to Checkout' });
		   		}
		   })
		   .catch(error => errorHandler(error, req, res))
}


//Retrieve User's Oders
// module.exports.myOrders = (req , res) => {

// 	if(!req.user.id) {
// 		res.status(401).send({ message: "Unauthorized access"})
// 	}

// 	return Order.find({userId: req.user.id}).then(orders => {

// 		if(!orders) {
// 			return res.status(404).send({ message: "No orders found"})
// 		} else {
// 			res.status(200).send({orders: orders})
// 		}
// 	}).catch(error => errorHandler(error, req, res))
// }


// Retrieve All Orders from All Users as Admin
// module.exports.getAllOrders = (req , res) => {

// 	if(req.user.id === !User.isAdmin) {
// 		res.status(401).send({ message: "Unauthorized access"})
// 	}

// 	return Order.find({}).then(result => {
// 		if(result.length > 0) {
// 			res.status(200).send({orders: result})
// 		} else {
// 			return res.status(404).send({message: "No orders found"})
// 		}
// 	}).catch(error => errorHandler(error, req,res))
// }


//Retrieve logged in user's orders.
module.exports.getUserOrder = (req, res) => {
  let userId = req.user.id; 
  Order.find({ userId: userId })
    .then((orders) => {
      if (orders.length === 0) {
        return res.status(404).send({ message: 'No orders found.' });
      }
      res.status(200).send({ orders });
    })
    .catch(error => errorHandler(error, req, res))
};


module.exports.getAllOrders = (req, res) => {
  Order.find()
    .then((orders) => {
      if (orders.length === 0) {
        return res.status(404).send({ message: 'No orders found.' });
      }
      res.status(200).send({ orders });
    })
    .catch(error => errorHandler(error, req, res))
};