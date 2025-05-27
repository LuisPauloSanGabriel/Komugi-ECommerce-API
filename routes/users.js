const express = require('express')
const userController = require('../controllers/users')
const {verify, verifyAdmin} = require('../auth')

const router = express.Router()

//[SECTION] Route for User Registration
router.post("/register", userController.registerUser);

//[SECTION] Route for User Login
router.post("/login", userController.loginUser);

//Route for user retrieve
router.get("/details", verify, userController.getUsers)

//Set User to Admin
router.patch("/:id/set-as-admin", verify, verifyAdmin, userController.setAsAdmin)

//Change password
router.patch('/update-password', verify, userController.updatePassword);


module.exports = router