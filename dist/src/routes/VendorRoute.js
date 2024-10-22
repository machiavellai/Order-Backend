"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.VandorRoute = void 0;
const express_1 = __importDefault(require("express"));
const controller_1 = require("../controller");
const middlewares_1 = require("../middlewares");
const multer_1 = __importDefault(require("multer"));
const router = express_1.default.Router();
exports.VandorRoute = router;
const imageStorage = multer_1.default.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'images');
    },
    filename: function (req, file, cb) {
        cb(null, new Date().toISOString() + '_' + file.originalname);
    }
});
const images = (0, multer_1.default)({ storage: imageStorage }).array('images', 10);
router.post('/login', controller_1.VendorLogin);
router.get('/profile', middlewares_1.Authenticate, controller_1.GetVendorProfile);
router.patch('/profile', middlewares_1.Authenticate, controller_1.UpdateVendorProfile);
router.patch('/coverImage', middlewares_1.Authenticate, images, controller_1.UpdateVendorCoverImage);
router.patch('/service', middlewares_1.Authenticate, controller_1.UpdateVendorService);
//food functionality
router.post('/food', middlewares_1.Authenticate, images, controller_1.AddFood);
router.get('/getfoods', middlewares_1.Authenticate, controller_1.GetFood);
router.get('/', (req, res, next) => {
    res.json({ message: "Hello from Vandor" });
});
//# sourceMappingURL=VendorRoute.js.map