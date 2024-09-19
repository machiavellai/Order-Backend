import { Request, Response, NextFunction } from 'express'
import { VendorLoginInputs } from '../dto';
import { FindVendor } from './AdminController';
import { ValidatePassword } from '../utility';


export const VendorLogin = async (req: Request, res: Response, next: NextFunction) => {

    const { email, password } = <VendorLoginInputs>req.body;

    const existingVendor = await FindVendor('', email)

    if (existingVendor !== null) {

        //validation and access

        const validation = await ValidatePassword(password, existingVendor.password, existingVendor.salt)

        if (validation) {
            return res.json(existingVendor)
        } else {
            return res.json({ "message": "Password is not valid" })
        }

    }

}

export const GetVendorProfile = async (req: Request, res: Response, next: NextFunction) => {
    
}

export const UpdateVendorProfile = async (req: Request, res: Response, next: NextFunction) => {

}

export const UpdateVendorService = async (req: Request, res: Response, next: NextFunction) => {

}
