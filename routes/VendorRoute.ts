import express, { Request, Response, NextFunction } from 'express';
import { AddFood, GetFood, GetVendorProfile, UpdateVendorCoverImage, UpdateVendorProfile, UpdateVendorService, VendorLogin } from '../controller';
import { Authenticate } from '../middlewares';
import multer from 'multer';



const router = express.Router();

const imageStorage = multer.diskStorage({

    destination: function (req, file, cb) {
        cb(null, 'images')
    },
    filename: function (req, file, cb) {
        cb(null, new Date().toISOString() + '_' + file.originalname)
    }

})

const images = multer({ storage: imageStorage }).array('images', 10)

router.post('/login', VendorLogin)

router.get('/profile', Authenticate, GetVendorProfile)
router.patch('/profile', Authenticate, UpdateVendorProfile)
router.patch('/coverImage', Authenticate, images, UpdateVendorCoverImage)
router.patch('/service', Authenticate, UpdateVendorService)

//food functionality
router.post('/food', Authenticate, images, AddFood)
router.get('/getfoods', Authenticate, GetFood)


router.get('/', (req: Request, res: Response, next: NextFunction) => {

    res.json({ message: "Hello from Vandor" })

})



export { router as VandorRoute }