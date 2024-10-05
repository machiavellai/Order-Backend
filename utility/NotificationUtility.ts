import { Client, } from "twilio/lib/base/BaseTwilio"
// import { PhoneNumber } from "twilio/lib/interfaces"



export const GenerateOtp = () => {

    const otp = Math.floor(100000 + Math.random() * 900000)

    let expiry = new Date()

    expiry.setTime(new Date().getTime() + (30 * 60 * 1000))

    return { otp, expiry }
}



export const onRequestOTP = async (otp: number, toPhoneNumber: string) => {


    const accountSid = "ACac4a43fae7bb57990dc62fc2ca31a488";
    const authTOken = "61c2238fee3d26805a69dae906986a94";
    const client = require('twilio')(accountSid, authTOken)



    const response = await client.messages.create({
        body: `Your OTP is ${otp}`,
        from: '+18504275967',
        to: `+234${toPhoneNumber}`,

    })
    console.log('Twilio response:', response);

    return response;

}