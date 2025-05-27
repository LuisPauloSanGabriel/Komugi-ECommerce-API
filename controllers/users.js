const bcrypt = require('bcrypt');
const User = require('../models/User')
const auth = require('../auth');
const mongoose = require('mongoose')
const { errorHandler } = require('../auth')


//[SECTION] User registration
module.exports.registerUser = (req, res) => {
	let newUser = new User({
		firstName: req.body.firstName,
		lastName: req.body.lastName,
		email: req.body.email,
		password: bcrypt.hashSync(req.body.password, 10),
		mobileNo: req.body.mobileNo,
	});

    if(!req.body.email.includes("@")){
        return res.status(400).send({ error: "Email invalid"})
    }

    if(req.body.mobileNo.length !== 11) {
        return res.status(400).send({ error: "Mobile number invalid"})
    }

	if (req.body.password.length < 8) {
    return res.status(400).send({ error: 'Password must be at least 8 characters.' });
    }

  	return newUser.save()
    .then((result) => res.status(201).send({
        message: "Registered successfully"
    }))
    .catch(error => errorHandler(error, req, res))
  
};


//[SECTION] User login
module.exports.loginUser = (req, res) => {

    if(req.body.email.includes("@")) {

    return User.findOne({ email: req.body.email })
    .then(result => {
        if (result == null){
        return res.status(404).send({ error: 'No email found'});
    } 
    if(req.body.email == null  || req.body.password == null){
        return res.status(401).send({ error: 'Email and password do not match' });
    } 
    else {
        const isPasswordCorrect = bcrypt.compareSync(req.body.password, result.password);
            if (isPasswordCorrect) {
                return res.status(200).send({ access: auth.createAccessToken(result) });
            } else {
                return res.status(401).send(false);
      }
    }
}).catch(error => errorHandler(error, req, res));

} else {
    return res.status(400).send(false);
}
};


//Get users
module.exports.getUsers = (req, res) => {
    return User.findById(req.user.id).then(result=>{
        if(result){
             return res.status(200).send(result)
         } else {
            return res.status(404).send({ error: "User not found"})
         }
    }).catch(error => errorHandler(error, req, res))
}   



//Set user to an Admin
module.exports.setAsAdmin = async (req, res) => {
    console.log(req.params.id)

    return User.findById(req.params.id)
    .then(result => {
        console.log(result)

        if(result === null) {
            return res.status(404).send({error: "User not found"})
        } else {
            result.isAdmin = true;
            return result.save()
            .then((updatedUser) => res.status(200).send({updatedUser}))
            .catch(err => res.status(500).send({ error: "Failed in Saving", details: err}))
        }
    }).catch(err => res.status(500).send({error: "Failed in Find", details: err}))
}


//Reset password

module.exports.updatePassword = ( req , res ) => {
    const { newPassword } = req.body;
    const { id } = req.user;

    if(id) {

        if(newPassword !== null) {
            bcrypt.hash(newPassword, 10)
            .then(hashedPassword => {
                res.status(201).send({ message: "Password reset successfully"})
                return User.findByIdAndUpdate(id, { password: hashedPassword });
            }).catch(error => errorHandler(error, req, res))
        } else {
            res.status(200).send({
                error: "Failed to reset password",
                details: "Illegal arguments: undefined, number"
            })
        }

    } else {
        return res.status(200).send({
            auth: "Failed",
            message: "invalid"
        })
    }
}