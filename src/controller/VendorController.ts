import { Request, Response, NextFunction } from 'express'
import { EditVendorInputs, VendorLoginInputs, VendorPayload } from '../dto';
import { FindVendor } from './AdminController';
import { GenerateSignature, ValidatePassword } from '../utility';
import { CreateFoodInput } from '../dto/Food.dto';
import { Food } from '../models/Food';
import { Order } from '../models/Order';


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

    // console.log('User from req in UpdateVendorProfile:', req.user);

    const { foodType, name, address, phone } = <EditVendorInputs>req.body

    const user = req.user as VendorPayload

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


export const UpdateVendorCoverImage = async (req: Request, res: Response, next: NextFunction) => {

    const user = req.user;

    if (user) {


        const vendor = await FindVendor(user._id)
        // console.log(vendor);

        if (vendor !== null) {

            //adding the images file to the vendor data
            const files = req.files as [Express.Multer.File]

            const images = files.map((file: Express.Multer.File) => file.filename)

            vendor.coverImages.push(...images)


            const result = await vendor.save();
            // console.log(result);
            return res.json(result)
        }
    }

    return res.json({ "message": "Something went wrong with addFood" })
}

export const UpdateVendorService = async (req: Request, res: Response, next: NextFunction) => {
    const user = req.user;




    if (user) {
        const existingVendor = await FindVendor(user._id)


        if (existingVendor !== null) {
            existingVendor.serviceAvailable = !existingVendor.serviceAvailable;
            const savedResult = await existingVendor.save();
            return res.json(savedResult)
        }

        return res.json(existingVendor)
    }

    return res.json({ "message": "Vendor information Not Found" })
}


export const AddFood = async (req: Request, res: Response, next: NextFunction) => {
    const user = req.user;

    if (user) {

        const { name, description, category, foodType, readyTime, price } = <CreateFoodInput>req.body

        const vendor = await FindVendor(user._id)
        // console.log(vendor);

        if (vendor !== null) {

            //adding the images file to the vendor data
            const files = req.files as [Express.Multer.File]

            const images = files.map((file: Express.Multer.File) => file.filename)

            const createdFood = await Food.create({
                vendorId: vendor._id,
                name: name,
                description: description,
                category: category,
                foodType: foodType,
                images: images,
                readyTime: readyTime,
                price: price,
                rating: 0
            })

            vendor.foods.push(createdFood);
            const result = await vendor.save();
            // console.log(result);
            return res.json(result)
        }
    }

    return res.json({ "message": "Something went wrong with addFood" })
}



export const GetFood = async (req: Request, res: Response, next: NextFunction) => {
    const user = req.user;

    if (user) {

        const foods = await Food.find({ vendorId: user._id })

        if (foods !== null) {
            return res.json(foods)
        }

    }

    return res.json({ "message": "Food were not FOund" })
}



export const GetCurrentOrders = async (req: Request, res: Response, next: NextFunction) => {


    const user = req.user;

    if (user) {
        const orders = await Order.find({ vendorId: user._id }).populate('items.food')

        if (orders != null) {
            return res.status(200).json(orders)
        }



    }
    return res.json({ "message": "orders not found" })
}


export const GetrOderDetails = async (req: Request, res: Response, next: NextFunction) => {

    const orderId = req.params.id;;

    if (orderId) {
        const order = await Order.findById(orderId).populate('items.food')

        if (order != null) {
            return res.status(200).json(order)
        }



    }
    return res.json({ "message": "orders not found" })
}


export const ProcessOrder = async (req: Request, res: Response, next: NextFunction) => {

    const orderId = req.params.id;

    const { status, remarks, time } = req.body; //ACCEPT // REJECT // UNDER-PROCESS // READY

    if (orderId) {

        const order = await Order.findById(orderId).populate('food');

        order.orderStatus = status;

        order.remarks = remarks;

        if (time) {
            order.readyTime = time;
        }
        const orderResult = await order.save();
        if (orderResult !== null) {
            return res.json({ "message": "Unable to process order!" })
        }
    }

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