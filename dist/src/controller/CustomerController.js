"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetOrdersById = exports.GetOrders = exports.CreateOrder = exports.EditCustomerProfile = exports.GetCustomerProfile = exports.RequestOtp = exports.VerifyCustomer = exports.CustomerLogin = exports.CustomerSignup = void 0;
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
const Customer_dto_1 = require("../dto/Customer.dto");
const utility_1 = require("../utility");
const Customer_1 = require("../models/Customer");
const models_1 = require("../models");
const Order_1 = require("../models/Order");
const CustomerSignup = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const customerInputs = (0, class_transformer_1.plainToClass)(Customer_dto_1.CreateCustomerInpiuts, req.body);
    const inputErrors = yield (0, class_validator_1.validate)(customerInputs, { validationError: { target: true } });
    if (inputErrors.length > 0) {
        return res.status(400).json(inputErrors);
    }
    const { email, phone, password } = customerInputs;
    const salt = yield (0, utility_1.GenerateSalt)();
    const userPassword = yield (0, utility_1.GeneratePassword)(password, salt);
    const { otp, otpKey } = yield (0, utility_1.GenerateOtpAndStoreInRedis)(); // Use Redis OTP
    const { expiry } = (0, utility_1.GenerateOtp)();
    const existingCustomer = yield Customer_1.Customer.findOne({ email: email });
    if (existingCustomer) {
        return res.status(409).json({ message: 'email already exsist' });
    }
    const result = yield Customer_1.Customer.create({
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
    });
    if (result) {
        const signature = yield (0, utility_1.GenerateSignature)({
            _id: result.id,
            email: result.email,
            verified: result.verified
        });
        return res.status(201).json({
            signature: signature,
            verified: result.verified,
            email: result.email,
            otp: otp, // Include OTP in response
            otpKey: otpKey
        });
    }
    return res.status(400).json({ message: 'Error with Signing Up!' });
});
exports.CustomerSignup = CustomerSignup;
const CustomerLogin = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const loginInputs = (0, class_transformer_1.plainToClass)(Customer_dto_1.UserLoginInpiuts, req.body);
    const loginErros = yield (0, class_validator_1.validate)(loginInputs, { validationError: { target: false } });
    if (loginErros.length > 0) {
        return res.status(400).json(loginErros);
    }
    const { email, password } = loginInputs;
    const customer = yield Customer_1.Customer.findOne({ email: email });
    if (customer) {
        const validation = yield (0, utility_1.ValidatePassword)(password, customer.password, customer.salt);
        if (validation) {
            const signature = yield (0, utility_1.GenerateSignature)({
                _id: customer.id,
                email: customer.email,
                verified: customer.verified
            });
            return res.status(201).json({
                signature: signature,
                verified: customer.verified,
                email: customer.email,
            });
        }
    }
    return res.status(400).json({ message: 'Error with Login IN!' });
});
exports.CustomerLogin = CustomerLogin;
const VerifyCustomer = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { otp } = req.body;
    const customer = req.user;
    console.log("Customer from request:", customer);
    if (customer) {
        const profile = yield Customer_1.Customer.findById(customer._id);
        console.log("Profile found:", profile);
        if (profile) {
            // Check if OTP matches
            console.log("OTP from profile:", profile.otp);
            console.log("OTP from request:", otp);
            // Check if OTP is valid and not expired
            console.log("OTP expiry date:", profile.otp_expiry);
            console.log("Current date:", new Date());
            if (profile.otp === parseInt(otp) && profile.otp_expiry >= new Date()) {
                profile.verified = true;
                const updatedCustomerResponse = yield profile.save();
                //generate the signature
                const signature = yield (0, utility_1.GenerateSignature)({
                    _id: updatedCustomerResponse.id,
                    email: updatedCustomerResponse.email,
                    verified: updatedCustomerResponse.verified,
                });
                return res.status(201).json({
                    signature: signature,
                    verified: updatedCustomerResponse.verified,
                    email: updatedCustomerResponse.email
                });
            }
        }
    }
    return res.status(400).json({ message: 'Error with OTP validation!' });
});
exports.VerifyCustomer = VerifyCustomer;
const RequestOtp = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const customer = req.user;
    if (customer) {
        const profile = yield Customer_1.Customer.findById(customer._id);
        if (profile) {
            const { expiry } = (0, utility_1.GenerateOtp)();
            const { otp, otpKey } = yield (0, utility_1.GenerateOtpAndStoreInRedis)();
            profile.otp = otp;
            profile.otp_expiry = expiry;
            yield profile.save();
            yield (0, utility_1.GenerateOtpAndStoreInRedis)();
            res.status(200).json({ message: "OTP sent to your registered phone provider" });
        }
    }
    return res.status(400).json({ message: 'Error with Requested OTP' });
});
exports.RequestOtp = RequestOtp;
const GetCustomerProfile = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const customer = req.user;
    if (customer) {
        const profile = yield Customer_1.Customer.findById(customer._id);
        if (profile) {
            res.status(200).json(profile);
        }
    }
    return res.status(400).json({ message: 'Error with Requested OTP' });
});
exports.GetCustomerProfile = GetCustomerProfile;
const EditCustomerProfile = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const customer = req.user;
    const profileInputs = (0, class_transformer_1.plainToClass)(Customer_dto_1.EditCustomerProfileInputs, req.body);
    const profileErrors = yield (0, class_validator_1.validate)(profileInputs, { validationError: { target: false } });
    if (profileErrors.length > 0) {
        return res.status(400).json(profileErrors);
    }
    const { firstName, lastName, address } = profileInputs;
    if (customer) {
        const profile = yield Customer_1.Customer.findById(customer._id);
        if (profile) {
            profile.firstName = firstName;
            profile.lastName = lastName;
            profile.address = address;
            const result = yield profile.save();
            res.status(200).json({ message: 'OTP sent to your registered phone number' });
        }
    }
});
exports.EditCustomerProfile = EditCustomerProfile;
const CreateOrder = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    //grab current login customer
    const customer = req.user;
    if (customer) {
        // create an order ID
        const orderId = `${Math.floor(Math.random() * 89999) + 1000}`;
        const profile = yield Customer_1.Customer.findById(customer._id);
        console.log('Customer Profile:', profile);
        //Grab order items from request [ { id: XX, unit : XX}]
        const cart = req.body; // [{id: XX, unit: XX}]
        let cartItems = Array();
        let netAmount = 0.0;
        //calculate order amount
        const foods = yield models_1.Food.find().where('_id').in(cart.map(item => item._id)).exec();
        foods.map(food => {
            cart.map(({ _id, unit }) => {
                if (food._id == _id) {
                    netAmount += (food.price * unit);
                    cartItems.push({ food, unit });
                }
            });
        });
        //create order with item description
        if (cartItems) {
            //create order
            const currentOrder = yield Order_1.Order.create({
                orderId: orderId,
                items: cartItems,
                totalAmount: netAmount,
                orderDate: new Date(),
                paidThrough: "COD",
                paymentResponse: "",
                orderStatus: 'waiting'
            });
            if (currentOrder) {
                console.log('Before push:', profile.orders); // Log before push
                profile.orders.push(currentOrder);
                yield profile.save();
                console.log('After push:', profile.orders);
                return res.status(200).json(currentOrder);
            }
        }
    }
    return res.status(400).json({ message: "errow with Create Order" });
});
exports.CreateOrder = CreateOrder;
const GetOrders = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    //grab current login customer
    const customer = req.user;
    // Log the customer object
    // console.log('Customer from Token:', customer);
    if (customer) {
        // create an order ID
        const profile = yield Customer_1.Customer.findById(customer._id).populate("orders");
        // // Log the populated orders
        // console.log('Order IDs:', profile.orders);
        // console.log('Populated Orders:', profile.orders);
        if (profile) {
            // Manually query the Order model
            const orders = yield Order_1.Order.find({ _id: { $in: profile.orders } });
            // console.log('Orders Found in DB:', orders);
            return res.status(200).json(profile.orders);
        }
    }
    return res.status(400).json({ message: "No customer found" });
});
exports.GetOrders = GetOrders;
const GetOrdersById = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const orderId = req.params.id;
    if (orderId) {
        const order = yield Order_1.Order.findById(orderId).populate('items.food');
        res.status(200).json(order);
    }
});
exports.GetOrdersById = GetOrdersById;
//# sourceMappingURL=CustomerController.js.map