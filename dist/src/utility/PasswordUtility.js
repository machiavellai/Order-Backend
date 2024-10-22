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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ValidateSignature = exports.GenerateSignature = exports.ValidatePassword = exports.GeneratePassword = exports.GenerateSalt = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = require("../config");
// import { Request } from 'express'
const GenerateSalt = () => __awaiter(void 0, void 0, void 0, function* () {
    return yield bcrypt_1.default.genSalt();
});
exports.GenerateSalt = GenerateSalt;
const GeneratePassword = (password, salt) => __awaiter(void 0, void 0, void 0, function* () {
    return yield bcrypt_1.default.hash(password, salt);
});
exports.GeneratePassword = GeneratePassword;
const ValidatePassword = (enteredPassword, savedPassword, salt) => __awaiter(void 0, void 0, void 0, function* () {
    return (yield (0, exports.GeneratePassword)(enteredPassword, salt)) === savedPassword;
});
exports.ValidatePassword = ValidatePassword;
//implementing jwt to serve as a code to all endpoints that requireauthentication
const GenerateSignature = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    return jsonwebtoken_1.default.sign(payload, config_1.APP_SECRET, { expiresIn: '90d' });
});
exports.GenerateSignature = GenerateSignature;
const ValidateSignature = (req) => __awaiter(void 0, void 0, void 0, function* () {
    const signature = req.get('Authorization');
    // console.log('Authorization Header:', signature); // Log the Authorization header
    if (signature && signature.startsWith('Bearer ')) {
        const token = signature.split(' ')[1];
        // console.log('Extracted Token:', token);  // Log the token
        try {
            // Verify the token and return the decoded user payload
            const payload = jsonwebtoken_1.default.verify(token, config_1.APP_SECRET);
            // console.log('Decoded Payload:', payload); // Log the decoded payload
            req.user = payload; // Assign the payload to req.user
            //
            return payload; // Token is valid, continue
        }
        catch (error) {
            console.log('Token verification failed:', error.message); // Log verification errors
            return false; // Return false if token verification fails
        }
    }
    else {
        console.error('No Authorization header or incorrect format');
    }
    return false;
});
exports.ValidateSignature = ValidateSignature;
// if (signature ) {
//     try {
//         const payload = jwt.verify(signature.split('')[1], APP_SECRET) as AuthPayload
//         // console.log('APP_SECRET:', APP_SECRET);
//         req.user = payload
//         return true
//     } catch (error) {
//         // console.error("Token verification failed:", error); // Log token verification errors
//         return false;
//     }
// }
//# sourceMappingURL=PasswordUtility.js.map