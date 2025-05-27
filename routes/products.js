const express = require('express')
const productController = require('../controllers/products')
const { verify, verifyAdmin } = require('../auth')


const router = express.Router()

//[SECTION] Route for creating products
router.post("/", verify, verifyAdmin, productController.createProduct); 

//[SECTION] Route for retrieving all products
router.get("/all", verify, verifyAdmin, productController.getAllProducts);

//[SECTION] Route for retrieving all active products
router.get("/active", productController.getAllActive);

//[SECTION] Route for retrieving single product
router.get("/:productsId", productController.singleProduct);

//Route for updating products as an admin
router.patch("/:productsId/update", verify, verifyAdmin, productController.updateProduct)


//Route for archiving product
router.patch("/:productsId/archive", verify, verifyAdmin, productController.archiveProduct)

// Route for activating a product
router.patch("/:productsId/activate", verify, verifyAdmin, productController.activateProduct)

//Route for Search by Name
router.post("/search-by-name", productController.searchProduct)


//Route for Search by Price
router.post("/search-by-price", productController.searchByPrice)
module.exports = router