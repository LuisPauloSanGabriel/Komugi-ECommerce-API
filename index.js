const express = require("express")
const mongoose = require("mongoose")
const cors = require("cors")


const userRoutes = require("./routes/users")
const productRoutes = require('./routes/products')
const cartRoutes = require('./routes/cart')
const orderRoutes = require('./routes/orders')

require('dotenv').config()


const app = express()

app.use(express.json())


const corsOptions = {
	origin: ['http://localhost:3000', 'http://ec2-3-129-204-74.us-east-2.compute.amazonaws.com/b5', 'http://zuitt-bootcamp-prod-520-8489-sangabriel.s3-website.us-east-1.amazonaws.com', 'https://komugi-e-commerce-frontend.vercel.app', 'https://komugi-e-commerce-frontend-3y61byaal.vercel.app'],
	credentials: true,
	optionSuccessStatus: 200
}

app.use(cors(corsOptions))

mongoose.connect(process.env.MONGODB_STRING)

mongoose.connection.once('open', () => console.log('Now connected to MongoDB Atlas'))

app.use("/b5/users", userRoutes)
app.use("/b5/products", productRoutes)
app.use("/b5/cart", cartRoutes)
app.use("/b5/orders", orderRoutes)

if(require.main === module) {
	app.listen(process.env.PORT || 3000, '0.0.0.0', () =>{
		console.log(`API is now online on port ${process.env.PORT || 3000}`)
	})
}

module.exports = {app, mongoose}