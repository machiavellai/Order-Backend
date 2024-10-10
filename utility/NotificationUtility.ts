import { Client, } from "twilio/lib/base/BaseTwilio"
// import { PhoneNumber } from "twilio/lib/interfaces"
import request from 'request';
import twilio from "twilio";


export const GenerateOtp = () => {

    const otp = Math.floor(100000 + Math.random() * 900000)

    let expiry = new Date()

    expiry.setTime(new Date().getTime() + (30 * 60 * 1000))

    return { otp, expiry }
}



export const onRequestOTP = async (otp: number, toPhoneNumber: string) => {

    const accountSid = 'ACac4a43fae7bb57990dc62fc2ca31a488'
    const authToken = 'b0bca1c3a623df8a991a1e6367585440'
    // const accountSid = process.env.TWILIO_ACCOUNT_SID;
    // const authToken = process.env.TWILIO_AUTH_TOKEN;


    const client = twilio(accountSid, authToken);
    console.log('Account SID:', accountSid);
    console.log('Auth Token:', authToken);


    const response = await client.messages.create({
        body: `Your OTP is ${otp}`,
        from: '+18504275967',
        to: `+234${toPhoneNumber}`,

    })
    console.log('Twilio response:', response);


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




}

