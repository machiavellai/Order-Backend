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
exports.GenerateOtpAndStoreInRedis = exports.GenerateOtp = void 0;
const Database_1 = require("../services/Database");
const uuid_1 = require("uuid");
// Utility function to generate OTP and expiry time
const GenerateOtp = () => {
    const otp = Math.floor(100000 + Math.random() * 900000); // Generate a 6-digit OTP
    let expiry = new Date(); // Set expiration time
    expiry.setTime(new Date().getTime() + (600 * 60 * 1000)); // 30 minutes expiration
    return { otp, expiry };
};
exports.GenerateOtp = GenerateOtp;
// Function to generate OTP and store in Redis
const GenerateOtpAndStoreInRedis = () => __awaiter(void 0, void 0, void 0, function* () {
    // Generate OTP
    const { otp, expiry } = (0, exports.GenerateOtp)();
    // Create a unique key using phone number and UUID
    const otpKey = `otp:$:${(0, uuid_1.v4)()}`;
    yield Database_1.redisClient.set(otpKey, otp, {
        EX: 1800 // 30 minutes expiry time
    });
    return { otp, otpKey }; // return both OTP and the key for later retrieval
});
exports.GenerateOtpAndStoreInRedis = GenerateOtpAndStoreInRedis;
// export const GenerateOtp = () => {
//     const otp = Math.floor(100000 + Math.random() * 900000)
//     let expiry = new Date()
//     expiry.setTime(new Date().getTime() + (30 * 60 * 1000))
//     return { otp, expiry }
// // Store OTP in Redis with an expiry
// export const storeOtpInRedis = async (phoneNumber: string, otp: string, expiry: number) => {
//     await redisClient.set(phoneNumber, otp, {
//         EX: expiry,  // Expiry in seconds
//     });
//     console.log('OTP stored in Redis with expiry');
// };
/// OTP PROVIDER FAILED CODE
// const accountSid = 'ACac4a43fae7bb57990dc62fc2ca31a488'
// const authToken = 'b0bca1c3a623df8a991a1e6367585440'
// // const accountSid = process.env.TWILIO_ACCOUNT_SID;
// // const authToken = process.env.TWILIO_AUTH_TOKEN;
// const client = twilio(accountSid, authToken);
// console.log('Account SID:', accountSid);
// console.log('Auth Token:', authToken);
// const response = await client.messages.create({
//     body: `Your OTP is ${otp}`,
//     from: '+18504275967',
//     to: `+234${toPhoneNumber}`,
// })
// console.log('Twilio response:', response);
// const options = {
//     method: 'GET',
//     url: 'https://api.authkey.io/request',  // Replace with the correct Authkey.io SMS URL if necessary
//     qs: {
//         authkey: '95640ea95ef2ee07',
//         mobile: `+234${toPhoneNumber}`,  // Phone number in international format
//         message: `Your OTP is ${otp}`,
//         sender: 'AUTHKY',
//         template_id: '14611'
//     },
// };
// return new Promise((resolve, reject) => {
//     request(options, function (error, response, body) {
//         if (error) {
//             console.error('Error sending OTP:', error);
//             return reject(error);
//         }
//         console.log('Authkey.io SMS response:', body);
//         const parsedBody = JSON.parse(body);
//         if (parsedBody.Status === 'Success') {
//             resolve(parsedBody);
//         } else {
//             console.error('Authkey.io Error:', parsedBody.Message);
//             reject(new Error(parsedBody.Message));
//         }
//     });
// });
//# sourceMappingURL=NotificationUtility.js.map