import express, { Request, Response, NextFunction } from 'express'
import {
    addToCart,
    CreateOrder,
    CustomerLogin,
    CustomerSignup
    , DeleteFromCart, EditCustomerProfile,
    GetCart, GetCustomerProfile, GetOrders
    , GetOrdersById, RequestOtp,
    VerifyCustomer
} from '../controller';
import { Authenticate } from '../middlewares';

const router = express.Router();

//Creare new user,

router.post('/signup', CustomerSignup)


//Login
router.post('/login', CustomerLogin)

router.use(Authenticate)


///verify Customer Account

router.patch('/verify', VerifyCustomer)


//Otp / Requesting OTP

router.get('/OTP', RequestOtp)


//profile

router.get('/profile', GetCustomerProfile)

router.patch('/profile', EditCustomerProfile)



//Cart
router.post('/create-order', addToCart)

router.get('/orders', GetCart)

router.delete('/order/:id', DeleteFromCart)



//Orders
router.post('/create-order', Authenticate, CreateOrder)

router.get('/orders', Authenticate, GetOrders)

router.get('/order/:id', GetOrdersById)




export { router as CustomerRoute }