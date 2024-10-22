import express, { Request, Response, NextFunction, response } from 'express'
import { validate, ValidationError } from 'class-validator'
import { plainToClass } from 'class-transformer'
import { CreateCustomerInpiuts, EditCustomerProfileInputs, OrderInputs, UserLoginInpiuts } from '../dto/Customer.dto'
import { GenerateOtp, GenerateOtpAndStoreInRedis, GeneratePassword, GenerateSalt, GenerateSignature, ValidatePassword } from '../utility'
import { Customer } from '../models/Customer'
import { Food } from '../models'
import { Order } from '../models/Order'

export const CustomerSignup = async (req: Request, res: Response, next: NextFunction) => {

    const customerInputs = plainToClass(CreateCustomerInpiuts, req.body)

    const inputErrors = await validate(customerInputs, { validationError: { target: true } })

    if (inputErrors.length > 0) {
        return res.status(400).json(inputErrors)
    }

    const { email, phone, password } = customerInputs;

    const salt = await GenerateSalt();
    const userPassword = await GeneratePassword(password, salt)

    const { otp, otpKey } = await GenerateOtpAndStoreInRedis();  // Use Redis OTP
    const { expiry } = GenerateOtp();

    const existingCustomer = await Customer.findOne({ email: email })

    if (existingCustomer) {
        return res.status(409).json({ message: 'email already exsist' });
    }

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
        lng: 0,
        orders: []
    })

    if (result) {

        const signature = await GenerateSignature({
            _id: result.id,
            email: result.email,
            verified: result.verified
        })

        return res.status(201).json({
            signature: signature,
            verified: result.verified,
            email: result.email,
            otp: otp,  // Include OTP in response
            otpKey: otpKey
        });

    }
    return res.status(400).json({ message: 'Error with Signing Up!' })
}

export const CustomerLogin = async (req: Request, res: Response, next: NextFunction) => {


    const loginInputs = plainToClass(UserLoginInpiuts, req.body)

    const loginErros = await validate(loginInputs, { validationError: { target: false } })


    if (loginErros.length > 0) {
        return res.status(400).json(loginErros)
    }

    const { email, password } = loginInputs;

    const customer = await Customer.findOne({ email: email })

    if (customer) {
        const validation = await ValidatePassword(password, customer.password, customer.salt);


        if (validation) {
            const signature = await GenerateSignature({
                _id: customer.id,
                email: customer.email,
                verified: customer.verified
            })


            return res.status(201).json({
                signature: signature,
                verified: customer.verified,
                email: customer.email,
            })
        }
    }
    return res.status(400).json({ message: 'Error with Login IN!' })

}

export const VerifyCustomer = async (req: Request, res: Response, next: NextFunction) => {

    const { otp } = req.body;
    const customer = req.user;
    console.log("Customer from request:", customer);


    if (customer) {

        const profile = await Customer.findById(customer._id)
        console.log("Profile found:", profile);

        if (profile) {

            // // Check if OTP matches
            // console.log("OTP from profile:", profile.otp);
            // console.log("OTP from request:", otp);

            // // Check if OTP is valid and not expired
            // console.log("OTP expiry date:", profile.otp_expiry);
            // console.log("Current date:", new Date());

            if (profile.otp === parseInt(otp) && profile.otp_expiry >= new Date()) {

                profile.verified = true;

                const updatedCustomerResponse = await profile.save();

                //generate the signature
                const signature = await GenerateSignature({
                    _id: updatedCustomerResponse.id,
                    email: updatedCustomerResponse.email,
                    verified: updatedCustomerResponse.verified,
                });

                return res.status(201).json({
                    signature: signature,
                    verified: updatedCustomerResponse.verified,
                    email: updatedCustomerResponse.email
                })
            }
        }
    }
    return res.status(400).json({ message: 'Error with OTP validation!' })
}

export const RequestOtp = async (req: Request, res: Response, next: NextFunction) => {


    const customer = req.user

    if (customer) {
        const profile = await Customer.findById(customer._id)

        if (profile) {
            const { expiry } = GenerateOtp();
            const { otp, otpKey } = await GenerateOtpAndStoreInRedis();

            profile.otp = otp
            profile.otp_expiry = expiry

            await profile.save();
            await GenerateOtpAndStoreInRedis()

            res.status(200).json({ message: "OTP sent to your registered phone provider" })
        }
    }
    return res.status(400).json({ message: 'Error with Requested OTP' })
}

export const GetCustomerProfile = async (req: Request, res: Response, next: NextFunction) => {

    const customer = req.user;

    if (customer) {

        const profile = await Customer.findById(customer._id)

        if (profile) {

            res.status(200).json(profile)
        }
    }
    return res.status(400).json({ message: 'Error with Requested OTP' })

}

export const EditCustomerProfile = async (req: Request, res: Response, next: NextFunction) => {

    const customer = req.user;

    const profileInputs = plainToClass(EditCustomerProfileInputs, req.body)

    const profileErrors = await validate(profileInputs, { validationError: { target: false } })

    if (profileErrors.length > 0) {

        return res.status(400).json(profileErrors)
    }

    const { firstName, lastName, address } = profileInputs

    if (customer) {

        const profile = await Customer.findById(customer._id)

        if (profile) {

            profile.firstName = firstName;
            profile.lastName = lastName;
            profile.address = address;

            const result = await profile.save();

            res.status(200).json({ message: 'OTP sent to your registered phone number' })
        }
    }
}



export const addToCart = async (req: Request, res: Response, next: NextFunction) => {

    
}

export const GetCart = async (req: Request, res: Response, next: NextFunction) => {


}

export const DeleteFromCart = async (req: Request, res: Response, next: NextFunction) => {


}


export const CreateOrder = async (req: Request, res: Response, next: NextFunction) => {

    //grab current login customer

    const customer = req.user

    if (customer) {
        // create an order ID

        const orderId = `${Math.floor(Math.random() * 89999) + 1000}`

        const profile = await Customer.findById(customer._id)
        console.log('Customer Profile:', profile);

        //Grab order items from request [ { id: XX, unit : XX}]
        const cart = <[OrderInputs]>req.body; // [{id: XX, unit: XX}]

        let cartItems = Array();

        let netAmount = 0.0;

        //calculate order amount

        const foods = await Food.find().where('_id').in(cart.map(item => item._id)).exec()

        foods.map(food => {
            cart.map(({ _id, unit }) => {
                if (food._id == _id) {
                    netAmount += (food.price * unit);
                    cartItems.push({ food, unit })
                }
            })
        })
        //create order with item description
        if (cartItems) {
            //create order
            const currentOrder = await Order.create({
                orderId: orderId,
                items: cartItems,
                totalAmount: netAmount,
                orderDate: new Date(),
                paidThrough: "COD",
                paymentResponse: "",
                orderStatus: 'waiting'
            })

            if (currentOrder) {
                console.log('Before push:', profile.orders);  // Log before push
                profile.orders.push(currentOrder);
                await profile.save()
                console.log('After push:', profile.orders);
                return res.status(200).json(currentOrder)
            }
        }

    }

    return res.status(400).json({ message: "errow with Create Order" })
}


export const GetOrders = async (req: Request, res: Response, next: NextFunction) => {

    //grab current login customer
    const customer = req.user

    // Log the customer object
    // console.log('Customer from Token:', customer);


    if (customer) {
        // create an order ID
        const profile = await Customer.findById(customer._id).populate("orders");

        // // Log the populated orders
        // console.log('Order IDs:', profile.orders);

        // console.log('Populated Orders:', profile.orders);

        if (profile) {

            // Manually query the Order model
            const orders = await Order.find({ _id: { $in: profile.orders } });

            // console.log('Orders Found in DB:', orders);

            return res.status(200).json(profile.orders);
        }
    }
    return res.status(400).json({ message: "No customer found" });
}

export const GetOrdersById = async (req: Request, res: Response, next: NextFunction) => {


    const orderId = req.params.id;

    if (orderId) {
        const order = await Order.findById(orderId).populate('items.food');

        res.status(200).json(order)
    }
}
