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
exports.GetFood = exports.AddFood = exports.UpdateVendorService = exports.UpdateVendorCoverImage = exports.UpdateVendorProfile = exports.GetVendorProfile = exports.VendorLogin = void 0;
const AdminController_1 = require("./AdminController");
const utility_1 = require("../utility");
const Food_1 = require("../models/Food");
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
// {
//     "_id": {
//       "$oid": "66ebe60b124969e79e047ef0"
//     },
//     "name": "Second Resturant",
//     "ownerName": "Mr Guest",
//     "foodType": [
//       "Carbs",
//       "Veg"
//     ],
//     "pincode": "400050",
//     "address": "10 obadiah Lane",
//     "phone": "0912345670",
//     "email": "ioun@gmail.com",
//     "password": "12345678",
//     "salt": "yyyuuiijjjuiop",
//     "coverImages": [],
//     "rating": 0,
//     "createdAt": {
//       "$date": "2024-09-19T08:51:23.673Z"
//     },
//     "updatedAt": {
//       "$date": "2024-09-19T08:51:23.673Z"
//     },
//     "__v": 0
//   }
//# sourceMappingURL=VendorController.js.map