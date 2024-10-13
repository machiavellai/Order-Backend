"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminRoute = void 0;
const express_1 = __importDefault(require("express"));
const controller_1 = require("../controller");
const router = express_1.default.Router();
exports.AdminRoute = router;
router.post('/vendor', controller_1.CreateVendor);
router.get('/getvendors', controller_1.GetVendor);
router.get('/vendor/:id', controller_1.GetVendorByID);
router.get('/', (req, res, next) => {
    res.json({ message: "Hello from Vandor" });
});
//# sourceMappingURL=AdminRoute.js.map