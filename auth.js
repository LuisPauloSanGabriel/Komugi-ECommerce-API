//Dependencies
const jwt = require("jsonwebtoken");

//[SECTION] Environment Setup
require('dotenv').config()


//[SECTION] JSON Web Tokens
/*
	-JSON Web Token or JWT is a way of securely passing information from the server to the client or to other parts of a server.

	- Information is kept secure through the use of the secret code
	- Only the system that knows the secret code can decode the encrypted information
	- Imagine JWT as a gift wrapping service that secures the gift with a lock
	- Only the person who knows the secret code can open the lock
	- And if the wrapper has been tampered with, JWT also recognizes this and disregards the gift
	- This ensures that the data is secure from the sender to the receiver.
*/

//[SECTION] Token Creation
/*
	Pack the gift and provide a lock with secret code as the key
*/
module.exports.createAccessToken = (user) => {
	//When the user logs in, a token will be created with the user's information
	const data = {
		id: user._id,
		email: user.email,
		isAdmin : user.isAdmin
	}

	//Generating a JSON web token using the jwt's sign method
	//Generates the token using the form data/postman data provided by the user in login request, and the secret code with no addition options provided
	//SECRET_KEY, is a user defined string data that will be used to create our JSON Web tokens
	//Since this is a critical data, we will use the .env to secure the secrey ket. "Keeping your secrets secret"
	return jwt.sign(data, process.env.JWT_SECRET_KEY, {})

}

//[SECTION] Token Verification
/*
	Analogy 
		- Receive the gift and open the lock to verify if the sender is legitimate and the gift was not tampered with
		- Verify will be used as a middleware in ExpressJS. Functions added as argument in an expressJS route are considered as middleware and is able to receive the request and response objects as well as the next() function.
*/

module.exports.verify = (req, res, next) => {
	console.log(req.headers.authorization);

	let token = req.headers.authorization

	if(typeof token === "undefined"){
		return res.send({
			details: "Authentication credentials were not provided"
		})
	} else {

		console.log(token);
		token = token.slice(7, token.length)
		console.log(token)

		//[SECTION] Token decryption
		/*
			Analogy 
				- Opening the gift and getting the contents
				- Validate the token using the "verify" method which is the means to decrypt the token using the secret code
				- token - the jwt token that was passed from the request headers
				- JWT_SECRET_KEY - the secret word from earlier which validates our token
				- function(err,decodedToken) - err contains the error in verification, decodedToken contains the decoded data within the token after the verification
		*/
		jwt.verify(token, process.env.JWT_SECRET_KEY, function(err, decodedToken){

			if (err) {
				return res.status(403).send({
					auth: "Failed",
					message: err.message
				})
			} else {
				console.log("result from verify method:")
				console.log(decodedToken)
				// Elsem if our token is verified to be correct, then we will update the request and add the user's decoded details
				req.user = decodedToken;	


				//Our verify middleware will give the req.user data to the handler function. 
				//Handler function should have access to "req.user" if the given token to the route is legitmate. 
				//This is possible because of the "next" function.
				next()
			}
		})
	}
}

module.exports.verifyAdmin = (req, res, next) => {
	// console.log("result from verifyAdmin method");
	// console.log(req.user)

	if(req.user.isAdmin){
		next()
	} else {
		return res.status(403).send({
			auth: "Failed",
			message: "Action Forbidden"
		})
	}
}


//[SECTION] Error Handler
module.exports.errorHandler = (err, req, res, next) => {
	console.error(err)


	const errorMessage = err.message || 'Internal Server Error';
	const statusCode = err.status || 500

	//We'ere setting a standardized error response
	res.status(statusCode).json({
		error: {
			message: errorMessage,
			errorCode: err.code || 'SERVER_ERROR',
			details: err.details || null
		}
	})
}

