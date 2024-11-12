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
exports.EditOffers = exports.AddOffer = exports.GetOffers = exports.ProcessOrder = exports.GetrOderDetails = exports.GetCurrentOrders = exports.GetFood = exports.AddFood = exports.UpdateVendorService = exports.UpdateVendorCoverImage = exports.UpdateVendorProfile = exports.GetVendorProfile = exports.VendorLogin = void 0;
const AdminController_1 = require("./AdminController");
const utility_1 = require("../utility");
const Food_1 = require("../models/Food");
const Order_1 = require("../models/Order");
const Offer_1 = require("../models/Offer");
const VendorLogin = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    const existingVendor = yield (0, AdminController_1.FindVendor)('', email);
    // console.log('Found Vendor:', existingVendor);
    if (existingVendor !== null) {
        //validation and access
        const validation = yield (0, utility_1.ValidatePassword)(password, existingVendor.password, existingVendor.salt);
        if (validation) {
            const signature = yield (0, utility_1.GenerateSignature)({
                _id: existingVendor.id,
                email: existingVendor.email,
                name: existingVendor.name,
                foodType: existingVendor.foodType
            });
            return res.json(signature);
        }
        else {
            return res.json({ "message": "Password is not valid" });
        }
    }
    return res.json({ "message": "Loging credentials are not valid" });
});
exports.VendorLogin = VendorLogin;
const GetVendorProfile = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user;
    if (user) {
        const existingVendor = yield (0, AdminController_1.FindVendor)(user._id);
        return res.json(existingVendor);
    }
    return res.json({ "message": "Vendor information Not Found" });
});
exports.GetVendorProfile = GetVendorProfile;
const UpdateVendorProfile = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    // console.log('User from req in UpdateVendorProfile:', req.user);
    const { foodType, name, address, phone } = req.body;
    const user = req.user;
    console.log('User from req:', user);
    if (user) {
        // Check if user._id is being sent as expected
        console.log('User ID:', user._id);
        const existingVendor = yield (0, AdminController_1.FindVendor)(user._id);
        console.log('Existing Vendor:', existingVendor); // Log the existing vendor
        if (existingVendor !== null) {
            existingVendor.name = name;
            existingVendor.address = address;
            existingVendor.phone = phone;
            existingVendor.foodType = foodType;
            const savedResult = yield existingVendor.save();
            console.log('Updated Vendor:', savedResult);
            // console.log(savedResult);
            return res.json(savedResult);
        }
        return res.json(existingVendor);
    }
    return res.json({ "message": "Vendor information Not Found" });
});
exports.UpdateVendorProfile = UpdateVendorProfile;
const UpdateVendorCoverImage = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user;
    if (user) {
        const vendor = yield (0, AdminController_1.FindVendor)(user._id);
        // console.log(vendor);
        if (vendor !== null) {
            //adding the images file to the vendor data
            const files = req.files;
            const images = files.map((file) => file.filename);
            vendor.coverImages.push(...images);
            const result = yield vendor.save();
            // console.log(result);
            return res.json(result);
        }
    }
    return res.json({ "message": "Something went wrong with addFood" });
});
exports.UpdateVendorCoverImage = UpdateVendorCoverImage;
const UpdateVendorService = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user;
    if (user) {
        const existingVendor = yield (0, AdminController_1.FindVendor)(user._id);
        if (existingVendor !== null) {
            existingVendor.serviceAvailable = !existingVendor.serviceAvailable;
            const savedResult = yield existingVendor.save();
            return res.json(savedResult);
        }
        return res.json(existingVendor);
    }
    return res.json({ "message": "Vendor information Not Found" });
});
exports.UpdateVendorService = UpdateVendorService;
const AddFood = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user;
    if (user) {
        const { name, description, category, foodType, readyTime, price } = req.body;
        const vendor = yield (0, AdminController_1.FindVendor)(user._id);
        // console.log(vendor);
        if (vendor !== null) {
            //adding the images file to the vendor data
            const files = req.files;
            const images = files.map((file) => file.filename);
            const createdFood = yield Food_1.Food.create({
                vendorId: vendor._id,
                name: name,
                description: description,
                category: category,
                foodType: foodType,
                images: images,
                readyTime: readyTime,
                price: price,
                rating: 0
            });
            vendor.foods.push(createdFood);
            const result = yield vendor.save();
            // console.log(result);
            return res.json(result);
        }
    }
    return res.json({ "message": "Something went wrong with addFood" });
});
exports.AddFood = AddFood;
const GetFood = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user;
    if (user) {
        const foods = yield Food_1.Food.find({ vendorId: user._id });
        if (foods !== null) {
            return res.json(foods);
        }
    }
    return res.json({ "message": "Food were not FOund" });
});
exports.GetFood = GetFood;
const GetCurrentOrders = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user;
    if (user) {
        const orders = yield Order_1.Order.find({ vendorId: user._id }).populate('items.food');
        if (orders != null) {
            return res.status(200).json(orders);
        }
    }
    return res.json({ "message": "orders not found" });
});
exports.GetCurrentOrders = GetCurrentOrders;
const GetrOderDetails = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const orderId = req.params.id;
    ;
    if (orderId) {
        const order = yield Order_1.Order.findById(orderId).populate('items.food');
        if (order != null) {
            return res.status(200).json(order);
        }
    }
    return res.json({ "message": "orders not found" });
});
exports.GetrOderDetails = GetrOderDetails;
const ProcessOrder = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const orderId = req.params.id;
    const { status, remarks, time } = req.body; //ACCEPT // REJECT // UNDER-PROCESS // READY
    if (orderId) {
        const order = yield Order_1.Order.findById(orderId).populate('items.food');
        order.orderStatus = status;
        order.remarks = remarks;
        if (time) {
            order.readyTime = time;
        }
        const orderResult = yield order.save();
        if (orderResult !== null) {
            return res.status(200).json(orderResult);
        }
    }
    return res.json({ "message": "unable to process Orders" });
});
exports.ProcessOrder = ProcessOrder;
const GetOffers = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user;
    // console.log(user);
    if (user) {
        let currentOffers = Array();
        const offers = yield Offer_1.Offer.find().populate('vendors');
        if (offers) {
            offers.map(item => {
                if (item.vendors) {
                    item.vendors.map(vendor => {
                        if (vendor._id.toString() === user._id) {
                            currentOffers.push(item);
                        }
                    });
                }
                if (item.offerType === "GENERIC") {
                    currentOffers.push(item);
                }
            });
        }
        return res.json(currentOffers);
    }
    return res.json({ "message": "unable to Get Offers" });
});
exports.GetOffers = GetOffers;
const AddOffer = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user;
    // console.log(user);
    if (user) {
        const { title, description, offerType, offerAmount, pincode, promoCode, promoType, startValidity, endValidity, bank, bins, minValue, isActive } = req.body;
        const vendor = yield (0, AdminController_1.FindVendor)(user._id);
        console.log(vendor);
        if (vendor) {
            const offer = yield Offer_1.Offer.create({
                title,
                description,
                offerType,
                offerAmount,
                pincode,
                promoCode,
                promoType,
                startValidity,
                endValidity,
                bank,
                bins,
                minValue,
                isActive,
                vendors: [vendor._id]
            });
            console.log(offer);
            return res.status(200).json(offer);
        }
    }
    return res.json({ "message": "unable to Add Offers" });
});
exports.AddOffer = AddOffer;
const EditOffers = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user;
    const offerId = req.params.id;
    // console.log(user);
    if (user) {
        const { title, description, offerType, offerAmount, pincode, promoCode, promoType, startValidity, endValidity, bank, bins, minValue, isActive } = req.body;
        // console.log(vendor);
        const currentOffer = yield Offer_1.Offer.findById(offerId);
        if (currentOffer) {
            const vendor = yield (0, AdminController_1.FindVendor)(user._id);
            if (vendor) {
                currentOffer.title = title,
                    currentOffer.description = description,
                    currentOffer.offerAmount = offerAmount,
                    currentOffer.offerType = offerType,
                    currentOffer.pincode = pincode,
                    currentOffer.promoCode = promoCode,
                    currentOffer.promoType = promoType,
                    currentOffer.startValidity = startValidity,
                    currentOffer.bank = bank,
                    currentOffer.endValidity = endValidity,
                    currentOffer.minValue = minValue,
                    currentOffer.bins = bins,
                    currentOffer.isActive = isActive;
                const result = yield currentOffer.save();
                console.log(result);
                return res.status(200).json(result);
            }
        }
    }
    return res.json({ "message": "unable to Add Offers" });
});
exports.EditOffers = EditOffers;
//# sourceMappingURL=VendorController.js.map