const mongoose = require('mongoose')


const productSchema = new mongoose.Schema ({

	name: {
		type: String,
		required: [true, "Product name is required"]
	},

	description: {
		type: String,
		required: [true, "Product description is required"]
	},

	price: {
		type: Number,
		required: [true, "Price is required"]
	},

	isActive: {
		type: Boolean,
		default: false
	},

	createOn: {
		type: Date,
		default: Date.now
	}
})


module.exports = mongoose.model('Product', productSchema)