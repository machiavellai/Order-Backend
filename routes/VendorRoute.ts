import express, { Request, Response, NextFunction } from 'express';
import { AddFood, GetFood, GetVendorProfile, UpdateVendorProfile, UpdateVendorService, VendorLogin } from '../controller';
import { Authenticate } from '../middlewares';

const router = express.Router();


router.post('/login', VendorLogin)



router.get('/profile', Authenticate, GetVendorProfile)
router.patch('/profile', Authenticate, UpdateVendorProfile)
router.patch('/service', Authenticate, UpdateVendorService)

//food functionality
router.post('/food',Authenticate, AddFood)
router.get('/getfoods',Authenticate, GetFood)


router.get('/', (req: Request, res: Response, next: NextFunction) => {

    res.json({ message: "Hello from Vandor" })

})



export { router as VandorRoute }