import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { APP_SECRET } from '../config'
import { AuthPayload } from '../dto'
import { Request } from 'express'
// import { Request } from 'express'

export const GenerateSalt = async () => {
    return await bcrypt.genSalt()
}

export const GeneratePassword = async (password: string, salt: string) => {
    return await bcrypt.hash(password, salt);
}

export const ValidatePassword = async (enteredPassword: string, savedPassword: string, salt: string) => {
    return await GeneratePassword(enteredPassword, salt) === savedPassword
}

//implementing jwt to serve as a code to all endpoints that requireauthentication

export const GenerateSignature = async (payload: any) => {

    return jwt.sign(payload, APP_SECRET, { expiresIn: '90d' });
}

declare module 'express-serve-static-core' {
    interface Request {
        user?: AuthPayload;
    }
}

export const ValidateSignature = async (req: Request) => {

    const signature = req.get('Authorization');
    // console.log('Authorization Header:', signature); // Log the Authorization header

    if (signature ) {
        try {
            const payload = jwt.verify(signature.split('')[1], APP_SECRET) as AuthPayload
            // console.log('APP_SECRET:', APP_SECRET);
            req.user = payload

            return true
        } catch (error) {
            // console.error("Token verification failed:", error); // Log token verification errors
            return false;
        }

    }
    return false
};