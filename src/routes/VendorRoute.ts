import express, { Request, Response, NextFunction } from 'express';
import { AddFood, GetCurrentOrders, GetFood, GetrOderDetails, GetVendorProfile, ProcessOrder, UpdateVendorCoverImage, UpdateVendorProfile, UpdateVendorService, VendorLogin } from '../controller';
import { Authenticate } from '../middlewares';
import multer from 'multer';
import path from 'path';



const router = express.Router();

const imageStorage = multer.diskStorage({

    destination: function (req, file, cb) {
        const imgPath = path.resolve(__dirname, '../images'); // or '../src/images' if it exists under src
        console.log("Image path:", imgPath);  // Log the resolved path
        cb(null, imgPath)
    },
    filename: function (req, file, cb) {
        cb(null, new Date().toISOString().replace(/:/g, '-') + '_' + file.originalname);
    }

})


// const imageStorage = multer.diskStorage({

//     destination: function (req, file, cb) {
//         const imgPath = path.resolve(__dirname, '../images'); // or '../src/images' if it exists under src
//         console.log("Image path:", imgPath);  // Log the resolved path
//         cb(null, imgPath);  // Resolve absolute path
//     },
//     filename: function (req, file, cb) {
//         cb(null, new Date().toISOString().replace(/:/g, '-') + '_' + file.originalname);
//     }
// });


const images = multer({ storage: imageStorage }).array('images', 10)

router.post('/login', VendorLogin)

router.get('/profile', Authenticate, GetVendorProfile)
router.patch('/profile', Authenticate, UpdateVendorProfile)
router.patch('/coverImage', Authenticate, images, UpdateVendorCoverImage)
router.patch('/service', Authenticate, UpdateVendorService)


//Orders
router.get('/orders', GetCurrentOrders)
router.put('/order/:id/process', ProcessOrder)
router.get('/order/:id', GetrOderDetails)


//food functionality
router.post('/food', Authenticate, images, AddFood)
router.get('/getfoods', Authenticate, GetFood)


router.get('/', (req: Request, res: Response, next: NextFunction) => {

    res.json({ message: "Hello from Vandor" })

})



export { router as VandorRoute }