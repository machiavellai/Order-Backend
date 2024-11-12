"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ShoppingRoute = void 0;
const express_1 = __importDefault(require("express"));
const controller_1 = require("../controller");
const middlewares_1 = require("../middlewares");
const router = express_1.default.Router();
exports.ShoppingRoute = router;
/** ------------------Food Availability */
router.get('/:pincode', middlewares_1.Authenticate, controller_1.GetFoodAvailability);
/** ------------------Food Availability */
router.get('/top-resturants/:pincode', controller_1.GetTopResturants);
/** ------------------Food Availability */
router.get('/foods-in-30-min/:pincode', controller_1.GetFoodIn30Min);
/** ------------------Food Availability */
router.get('/search/:pincode', controller_1.SearchFoods);
/** ------------------Food Availability */
/** ------------------------- Find Offers  ---------------------- */
router.get('/offers/:pincode', controller_1.GetAvailableOffers);
router.get('/resturant/:id', controller_1.ResturantById);
//# sourceMappingURL=ShoppingRoute.js.map