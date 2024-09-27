import { Request, Response, NextFunction } from 'express'
import { CreateVendorInput } from '../dto'
import { Vendor } from '../models';
import { GeneratePassword, GenerateSalt } from '../utility';

//to check vendor by ID/Email id exsists
export const FindVendor = async (id: string | undefined, email?: string) => {

    if (email) {
        return await Vendor.findOne({ email: email })
    } else {
        return await Vendor.findById(id)
    }
    return null
}



// if (email) {
//     return await Vendor.findOne({ email: email });
// } else if (id) {
//     return await Vendor.findById(id);  // Check that this is working as expected
// }
// return null;  // Return null if no valid ID or email



export const CreateVendor = async (req: Request, res: Response, next: NextFunction) => {

    const { name, address, pincode, foodType, email, password, ownerName, phone } = <CreateVendorInput>req.body;

    const existingVendor = await FindVendor('', email)

    if (existingVendor !== null) {
        return res.json({ "message": "A vendor is already with this email ID" })
    }

    //generate salt

    const salt = await GenerateSalt()
    const userPassword = await GeneratePassword(password, salt);
    //encrypt the password usign the salt


    //Creating the Vendor
    const createVendor = await Vendor.create({
        name: name,
        address: address,
        pincode: pincode,
        foodType: foodType,
        email: email,
        password: userPassword,
        salt: salt,
        ownerName: ownerName,
        phone: phone,
        rating: 0,
        serviceAvailable: "false",
        coverImages: [],
    })
    // console.log(createVendor)
    return res.json(createVendor)

}



export const GetVendor = async (req: Request, res: Response, next: NextFunction) => {

    const vendors = await Vendor.find()

    if (vendors !== null) {
        console.log(vendors);
        return res.json(vendors)
    }

    return res.json({ "message": " vendors data are not available" })
    // try {  
    //     const vendors = await Vendor.find();  

    //     if (vendors && vendors.length > 0) {  
    //         return res.json(vendors);  
    //     }  

    //     return res.status(404).json({ "message": "Vendors data are not available" });  
    // } catch (error) {  
    //     // Optionally log the error for debugging  
    //     console.error("Error fetching vendors: ", error);  
    //     return res.status(500).json({ "message": "Internal server error" });  
    // }    
}



export const GetVendorByID = async (req: Request, res: Response, next: NextFunction) => {


    const vendorId = req.params.id;

    const vendor = await FindVendor(vendorId)

    if (vendor !== null) {
        return res.json(vendor)
    }

    return res.json({
        "message": "vendors data not available"
    })
}

