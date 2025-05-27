const Product = require('../models/Product')
const mongoose = require('mongoose')
const { errorHandler } = require('../auth')


// [SECTION] Creating products
module.exports.createProduct = (req, res) => {

	let newProduct = new Product({
		name: req.body.name,
		description: req.body.description,
		price: req.body.price
	});
	
	Product.findOne({ name: req.body.name })
	.then(product => {
		if(product) {
			return res.status(200).send({ message: 'Product already exists' });
		}
	}).catch(error => errorHandler(error, req, res));

	return newProduct.save()
	.then((product) => res.status(201).send({ message: "Product created successfully"}))
	.catch(error => errorHandler (error, req, res))
	
}

// [SECTION] Retrieving all products
module.exports.getAllProducts = (req, res) => {
	return Product.find({})
	.then(result => {
	if(result.length > 0){
		return res.status(200).send(result);
	} else {
		return res.status(404).send({ message: 'No product found ' });
	}
})
.catch(error => errorHandler(error, req, res));
};

// [SECTION] Retrieving all active products
module.exports.getAllActive = (req, res) => {
    Product.find({ isActive: true })
    .then(result => res.status(200).send(result))
    .catch(error => errorHandler(error, req, res));
};

// [SECTION] Retrieving single product
module.exports.singleProduct = (req, res) => {
  
   return Product.findById(req.params.productsId)
    .then(product => {
      if (product) {
      	 return res.status(200).send(product);
      } else {
      	return res.status(404).send({ message: 'Product not found' });
      }
    })
    .catch(error => errorHandler(error, req, res))
};


// module.exports.singleProduct = (req , res) => {

// 		if(req.params.productsId) {
// 			 return Product.findById(req.params.productsId)
// 			 .then(product => {
// 			 		if(product){
// 			 			return res.status(200).send(product)
// 			 		} else {
// 			 			return res.status(404).send({ message: "Product not found"})
// 			 		}
// 			 }).catch(error => errorHandler(error, req, res))
// 		} else {
// 			return res.status(404).send({ message: "Invalid product ID"})
// 		}
// }

//Update Product Infromation

module.exports.updateProduct = (req , res) => {

	let updatedProduct = {
		name: req.body.name,
		description: req.body.description,
		price: req.body.price
		
	}

	
		return Product.findByIdAndUpdate(req.params.productsId, updatedProduct, {new: true})
		.then(product => {
			if(product){
				res.status(200).send(product)
			} else {
				res.status(404).send({message: "Product not found"})
			}
		})
}


// Archive product

module.exports.archiveProduct = (req , res) => {

	let productStatus = {
		isActive: false
	}

	return Product.findByIdAndUpdate(req.params.productsId, productStatus)
	.then(product => {
		if(product) {

			if(product.isActive === false){
				return res.status(200).send({
					message: "Product is already archived",
					product: product
				})
			} else {
				res.status(200).send({
					success: true,
					message: "Product archived successfully"
				})
			}
		} else {
			return res.status(404).send({message: "Product not found"})
		}
	}).catch(error => errorHandler(error, req, res))
}


//Activating a product

module.exports.activateProduct = (req , res) => {

	let productStatus = {
		isActive: true
	}


	return Product.findByIdAndUpdate(req.params.productsId, productStatus, {new: true})
	.then(product => {

		if(product) {
			if(product.isActive === true) {
				return res.status(200).send({
					message: "Product is already active",
					product: product
				})
			} else {
				return res.status(200).send({
					success: true,
					message: "Product activated successfully"
				})
			}
		} else {
			return res.status(404).send({error: "Product not found"})
		}
	})

}


//Search Product by Name

module.exports.searchProduct = (req , res) => {

	let name = req.body.name

	return Product.find({
		name: { $regex: name, $options: "i"}
	})
	.then(product => {

		if(product) {
			return res.status(200).send(product)
		} else {
			return res.send(404).send({ message: "Product not found"})
		}
	})
	.catch(error => errorHandler(error, req, res))
}


//Search Product By Price

module.exports.searchByPrice = (req, res) => {

    const { minPrice, maxPrice } = req.body;

    if (minPrice == null || maxPrice == null) {
      return res.status(400).send({ error: 'Both minPrice and maxPrice must be provided.' });
    }

    return Product.find({
      price: { $gte: minPrice, $lte: maxPrice }
    }).then(price => {
    	res.status(200).send(price);
    }).catch(error => errorHandler(error, req, res))
};