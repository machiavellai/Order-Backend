import { Request, Response, NextFunction } from 'express'
import { CreateVendorInput } from '../dto'
import { Vendor } from '../models';


export const CreateVandor = async (req: Request, res: Response, next: NextFunction) => {

    const { name, address, pincode, foodType, email, password, ownerName, phone } = <CreateVendorInput>req.body;

    const existingVendor = await Vendor.findOne({ email : email })

    if (existingVendor !== null) {
        return res.json({ "message": "A vendor is already with this email ID"})
    }


    
    //Creating the Vendor
    const createVendor = await Vendor.create({
        name: name,
        address: address,
        pincode: pincode,
        foodType: foodType,
        email: email,
        password: password,
        salt: 'yyyuuiijjjuiop',
        ownerName: ownerName,
        phone: phone,
        rating: 0,
        service: "false",
        coverImages: [],
    })
    // console.log(createVendor)
    return res.json(createVendor)

}



export const GetVendor = async (req: Request, res: Response, next: NextFunction) => {

}



export const GetvVendorByID = async (req: Request, res: Response, next: NextFunction) => {

}

