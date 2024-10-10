import express, { Request, Response, NextFunction } from 'express'
import { validate, ValidationError } from 'class-validator'
import { plainToClass } from 'class-transformer'
import { CreateCustomerInpiuts } from '../dto/Customer.dto'
import { GenerateOtp, GeneratePassword, GenerateSalt, GenerateSignature, onRequestOTP } from '../utility'
import { Customer } from '../models/Customer'
import { ObjectId } from 'mongodb';

export const CustomerSignup = async (req: Request, res: Response, next: NextFunction) => {

    const customerInputs = plainToClass(CreateCustomerInpiuts, req.body)

    const inputErrors = await validate(customerInputs, { validationError: { target: true } })

    if (inputErrors.length > 0) {
        return res.status(400).json(inputErrors)
    }

    const { email, phone, password } = customerInputs;

    const salt = await GenerateSalt();
    const userPassword = await GeneratePassword(password, salt)

    const { otp, expiry } = GenerateOtp();

    const result = await Customer.create({
        email: email,
        password: userPassword,
        salt: salt,
        phone: phone,
        otp: otp,
        otp_expiry: expiry,
        firstName: '',
        lastName: '',
        address: '',
        verified: false,
        lat: 0,
        lng:0
    })

    if (result) {

        await onRequestOTP(otp, phone)
 
        const signature = GenerateSignature({
            _id: result._id.toString(),
            email: result.email,
            verified: result.verified
        })

        return res.status(201).json({
            signature: signature,
            verified: result.verified,
            email: result.email
        });

        // return res.status(201).json({ signature: signature, verified: result.verified, email: result.email })
    }
    return res.status(400).json({ message: 'Error with Signing Up!' })
}

export const CustomerLogin = async (req: Request, res: Response, next: NextFunction) => {

}

export const VerifyCustomer = async (req: Request, res: Response, next: NextFunction) => {

}

export const RequestOtp = async (req: Request, res: Response, next: NextFunction) => {

}

export const GetCustomerProfile = async (req: Request, res: Response, next: NextFunction) => {

}

export const EditCustomerProfile = async (req: Request, res: Response, next: NextFunction) => {

}