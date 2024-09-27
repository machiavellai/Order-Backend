import { NextFunction, Request, Response } from "express";
import { AuthPayload } from "../dto";
import { ValidateSignature } from "../utility";


declare global {
    namespace Express {
        interface Request {
            user?: AuthPayload
        }
    }
}


export const Authenticate = async (req: Request, res: Response, next: NextFunction) => {

    // const signature = await ValidateSignature(req);

    const signature = req.get('Authorization');
    // console.log('Authorization Header in Middleware:', signature); // Log this to see if it's being passed

    const userPayload = await ValidateSignature(req);

    if (userPayload) {

        next()
    } else {
        return res.json({ "message": "user not Authorized " })
    }
}

