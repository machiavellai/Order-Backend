"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CustomerRoute = void 0;
const express_1 = __importDefault(require("express"));
const controller_1 = require("../controller");
const middlewares_1 = require("../middlewares");
const router = express_1.default.Router();
exports.CustomerRoute = router;
//Creare new user,
router.post('/signup', controller_1.CustomerSignup);
//Login
router.post('/login', controller_1.CustomerLogin);
router.use(middlewares_1.Authenticate);
///verify Customer Account
router.patch('/verify', controller_1.VerifyCustomer);
//Otp / Requesting OTP
router.get('/OTP', controller_1.RequestOtp);
//profile
router.get('/profile', controller_1.GetCustomerProfile);
router.patch('/profile', controller_1.EditCustomerProfile);
//orders
router.post('/create-order', middlewares_1.Authenticate, controller_1.CreateOrder);
router.get('/orders', middlewares_1.Authenticate, controller_1.GetOrders);
router.get('/order/:id', controller_1.GetOrdersById);
//# sourceMappingURL=CustomerRoute.js.map