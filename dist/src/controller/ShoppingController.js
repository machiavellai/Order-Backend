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
exports.GetAvailableOffers = exports.ResturantById = exports.SearchFoods = exports.GetFoodIn30Min = exports.GetTopResturants = exports.GetFoodAvailability = void 0;
const models_1 = require("../models");
const Offer_1 = require("../models/Offer");
const GetFoodAvailability = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const pincode = req.params.pincode;
    const result = yield models_1.Vendor.find({ pincode: pincode, serviceAvailable: false })
        .sort([['rating', 'descending']])
        .populate("foods");
    if (result.length > 0) {
        console.log(result);
        return res.status(200).json(result);
    }
    return res.status(400).json({ message: "Data not found" });
});
exports.GetFoodAvailability = GetFoodAvailability;
const GetTopResturants = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const pincode = req.params.pincode;
    const result = yield models_1.Vendor.find({ pincode: pincode, serviceAvailable: false })
        .sort([['rating', 'descending']])
        .limit(4);
    if (result.length > 0) {
        // console.log(result);
        return res.status(200).json(result);
    }
    return res.status(400).json({ message: "Data not found" });
});
exports.GetTopResturants = GetTopResturants;
const GetFoodIn30Min = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const pincode = req.params.pincode;
    const result = yield models_1.Vendor.find({ pincode: pincode, serviceAvailable: false })
        .populate("foods");
    if (result.length > 0) {
        let foodResult = [];
        result.map(vendor => {
            const foods = vendor.foods;
            foodResult.push(...foods.filter(food => food.readyTime <= 30));
        });
        return res.status(200).json(foodResult);
    }
    return res.status(400).json({ message: "Data not found" });
});
exports.GetFoodIn30Min = GetFoodIn30Min;
const SearchFoods = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const pincode = req.params.pincode;
    const result = yield models_1.Vendor.find({ pincode: pincode, serviceAvailable: false })
        .populate("foods");
    if (result.length > 0) {
        //logic to recieve only food items
        let foodResult = [];
        result.map(item => foodResult.push(...item.foods));
        return res.status(200).json(foodResult);
    }
    return res.status(400).json({ message: "Data not found" });
});
exports.SearchFoods = SearchFoods;
const ResturantById = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    const result = yield models_1.Vendor.findById(id).populate("foods");
    if (result) {
        return res.status(200).json(result);
    }
    return res.status(400).json({ message: "Data not found" });
});
exports.ResturantById = ResturantById;
const GetAvailableOffers = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const pincode = req.params.pincode;
    console.log("Requested Pincode:", pincode);
    const offers = yield Offer_1.Offer.find({ pincode: pincode, isActive: true }).populate('vendors');
    if (offers) {
        offers.forEach(offer => {
            console.log(`Offer Title: ${offer.title}, Pincode: ${offer.pincode}, isActive: ${offer.isActive}`);
            offer.vendors.forEach(vendor => {
                console.log(`Associated Vendor ID: ${vendor._id}`);
            });
        });
        return res.status(200).json(offers);
    }
    return res.status(400).json({ message: "Offers not found" });
});
exports.GetAvailableOffers = GetAvailableOffers;
//# sourceMappingURL=ShoppingController.js.map