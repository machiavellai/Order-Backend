import { Request, Response, NextFunction } from 'express'
import { EditVendorInputs, VendorLoginInputs } from '../dto';
import { FindVendor } from './AdminController';
import { GenerateSignature, ValidatePassword } from '../utility';


export const VendorLogin = async (req: Request, res: Response, next: NextFunction) => {

    const { email, password } = <VendorLoginInputs>req.body;

    const existingVendor = await FindVendor('', email)
    // console.log('Found Vendor:', existingVendor);


    if (existingVendor !== null) {

        //validation and access

        const validation = await ValidatePassword(password, existingVendor.password, existingVendor.salt)

        if (validation) {

            const signature = await GenerateSignature({
                _id: existingVendor.id,
                email: existingVendor.email,
                name: existingVendor.name,
                foodType: existingVendor.foodType
            })
            // console.log('Input Password:', password);
            // console.log('Stored Password:', existingVendor.password);
            // console.log('Stored Salt:', existingVendor.salt);

            // console.log('Generated Signature:', signature);
            return res.json(signature)
        } else {
            return res.json({ "message": "Password is not valid" })
        }

    }
    return res.json({ "message": "Loging credentials are not valid" })
}

export const GetVendorProfile = async (req: Request, res: Response, next: NextFunction) => {

    const user = req.user;

    if (user) {
        const existingVendor = await FindVendor(user._id)

        return res.json(existingVendor)
    }

    return res.json({ "message": "Vendor information Not Found" })

}

export const UpdateVendorProfile = async (req: Request, res: Response, next: NextFunction) => {

    console.log('User from req in UpdateVendorProfile:', req.user);

    const { foodType, name, address, phone } = <EditVendorInputs>req.body

    const user = req.user;

    console.log('User from req:', user);


    if (user) {

        // Check if user._id is being sent as expected
        console.log('User ID:', user._id);


        const existingVendor = await FindVendor(user._id)
        console.log('Existing Vendor:', existingVendor); // Log the existing vendor


        if (existingVendor !== null) {
            existingVendor.name = name;
            existingVendor.address = address;
            existingVendor.phone = phone;
            existingVendor.foodType = foodType;

            const savedResult = await existingVendor.save()
            console.log('Updated Vendor:', savedResult);
            // console.log(savedResult);
            return res.json(savedResult)
        }

        return res.json(existingVendor)
    }

    return res.json({ "message": "Vendor information Not Found" })
}

export const UpdateVendorService = async (req: Request, res: Response, next: NextFunction) => {

}








// {
//     "_id": {
//       "$oid": "66ebe60b124969e79e047ef0"
//     },
//     "name": "Second Resturant",
//     "ownerName": "Mr Guest",
//     "foodType": [
//       "Carbs",
//       "Veg"
//     ],
//     "pincode": "400050",
//     "address": "10 obadiah Lane",
//     "phone": "0912345670",
//     "email": "ioun@gmail.com",
//     "password": "12345678",
//     "salt": "yyyuuiijjjuiop",
//     "coverImages": [],
//     "rating": 0,
//     "createdAt": {
//       "$date": "2024-09-19T08:51:23.673Z"
//     },
//     "updatedAt": {
//       "$date": "2024-09-19T08:51:23.673Z"
//     },
//     "__v": 0
//   }