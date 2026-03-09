import * as userController from '../controllers/user.controller.js'
import * as Middleware from '../middleware/auth.js'
import * as productController from '../controllers/product.controller.js'
import * as CartController from '../controllers/cart.controller.js'
import express from 'express'
import multer from 'multer';

const router = express.Router();
const upload = multer();

router.post("/register", userController.registerController);

router.post('/login', userController.login)

// product
router.get('/products', productController.getAllProductController)

router.get('/products/:id', productController.getOneProducController)

// admin dashboard route
router.post('/createproduct', upload.single('image_url'),
    Middleware.Authentocation,
    Middleware.admin,
    productController.createProductController)

router.post('/updateproduct/:id', upload.single('image_url'),
    Middleware.Authentocation,
    Middleware.admin,
    productController.updateProductsController)

router.delete('/deleteproduct/:id', Middleware.Authentocation,
    Middleware.admin,
    productController.deleteProductsController)

// cart
router.post('/addtocart', Middleware.Authentocation,
    CartController.addToCartController)

router.get('/getcart/:user_id', Middleware.Authentocation,
    CartController.getCartFromUserController)

router.put('/cart/:id', Middleware.Authentocation,
    CartController.updatecartController)

router.delete('/cart/:id',Middleware.Authentocation,
    CartController.deleteCartController)

import *as OrderController from '../controllers/orders.controller.js'
// order
router.post('/createOrder',Middleware.Authentocation,
    OrderController.createOrderscontroller)
    
router.get('/getallorders',OrderController.getAllOrderscontroller)

export default router;