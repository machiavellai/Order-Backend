import express, { Request, Response, NextFunction } from 'express'
import { CustomerLogin, CustomerSignup, EditCustomerProfile, GetCustomerProfile, RequestOtp, VerifyCustomer } from '../controller';
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





export { router as CustomerRoute }