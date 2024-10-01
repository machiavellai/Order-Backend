import express, { Request, Response, NextFunction } from 'express'
import { CustomerLogin, CustomerSignup, EditCustomerProfile, GetCustomerProfile, RequestOtp, VerifyCustomer } from '../controller';

const router = express.Router();


//Creare new user

router.post('/signup', CustomerSignup)


//Login

router.post('/login', CustomerLogin)


///verify Customer Account

router.patch('/verify', VerifyCustomer)


//Otp / Requesting OTP

router.get('/OTP', RequestOtp)


//profile

router.get('/profile', GetCustomerProfile)

router.patch('/profile', EditCustomerProfile)





export { router as CustomerRoute }