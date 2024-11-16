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
exports.GetTransactionsById = exports.GetTransactions = exports.GetVendorByID = exports.GetVendor = exports.CreateVendor = exports.FindVendor = void 0;
const models_1 = require("../models");
const utility_1 = require("../utility");
const Transaction_1 = require("../models/Transaction");
//to check vendor by ID/Email id exsists
const FindVendor = (id, email) => __awaiter(void 0, void 0, void 0, function* () {
    if (email) {
        return yield models_1.Vendor.findOne({ email: email });
    }
    else {
        return yield models_1.Vendor.findById(id);
    }
    return null;
});
exports.FindVendor = FindVendor;
const CreateVendor = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, address, pincode, foodType, email, password, ownerName, phone } = req.body;
    const existingVendor = yield (0, exports.FindVendor)('', email);
    if (existingVendor !== null) {
        return res.json({ "message": "A vendor is already with this email ID" });
    }
    //generate salt
    const salt = yield (0, utility_1.GenerateSalt)();
    const userPassword = yield (0, utility_1.GeneratePassword)(password, salt);
    //encrypt the password usign the salt
    //Creating the Vendor
    const createVendor = yield models_1.Vendor.create({
        name: name,
        address: address,
        pincode: pincode,
        foodType: foodType,
        email: email,
        password: userPassword,
        salt: salt,
        ownerName: ownerName,
        phone: phone,
        rating: 0,
        serviceAvailable: "false",
        coverImages: [],
        foods: []
    });
    console.log(createVendor);
    return res.json(createVendor);
});
exports.CreateVendor = CreateVendor;
const GetVendor = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const vendors = yield models_1.Vendor.find();
    if (vendors !== null) {
        console.log(vendors);
        return res.json(vendors);
    }
    return res.json({ "message": " vendors data are not available" });
});
exports.GetVendor = GetVendor;
const GetVendorByID = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const vendorId = req.params.id;
    const vendor = yield (0, exports.FindVendor)(vendorId);
    if (vendor !== null) {
        return res.json(vendor);
    }
    return res.json({
        "message": "vendors data not available"
    });
});
exports.GetVendorByID = GetVendorByID;
const GetTransactions = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const transactions = yield Transaction_1.Transaction.find();
    if (transactions) {
        return res.status(200).json(transactions);
    }
    return res.json({ message: "Transactions not available!" });
});
exports.GetTransactions = GetTransactions;
const GetTransactionsById = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    const transaction = yield Transaction_1.Transaction.findById(id);
    if (transaction) {
        return res.status(200).json(transaction);
    }
    return res.json({ message: "Transaction not available!" });
});
exports.GetTransactionsById = GetTransactionsById;
//# sourceMappingURL=AdminController.js.map