import express, { Request, Response, NextFunction } from 'express'
import {
    addToCart,
    CreateOrder,
    CreatePayment,
    CustomerLogin,
    CustomerSignup,
    DeleteFromCart,
    EditCustomerProfile,
    GetCart,
    GetCustomerProfile,
    GetOrders,
    GetOrdersById,
    RequestOtp,
    VerifyCustomer,
    VerifyOffer
} from '../controller';
import {
    Authenticate
} from '../middlewares';

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
router.post('/addToCart', addToCart)

router.get('/GetCart', GetCart)

router.delete('/deleteCart', DeleteFromCart)



//apply offers
router.get('/offer/verify/:id', Authenticate, VerifyOffer)


//payment
router.post('/create-Payment', Authenticate, CreatePayment)


//Orders
router.post('/create-order', Authenticate, CreateOrder)

router.get('/orders', Authenticate, GetOrders)

router.get('/order/:id', GetOrdersById)




export { router as CustomerRoute }