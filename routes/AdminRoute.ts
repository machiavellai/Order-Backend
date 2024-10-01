import express, { Request, Response, NextFunction } from 'express';
import { CreateVendor, GetVendor, GetVendorByID } from '../controller';

const router = express.Router();

router.post('/vendor', CreateVendor)

router.get('/getvendors', GetVendor)

router.get('/vendor/:id', GetVendorByID)


router.get('/', (req: Request, res: Response, next: NextFunction) => {

    res.json({ message: "Hello from Vandor" })

})




export { router as AdminRoute }