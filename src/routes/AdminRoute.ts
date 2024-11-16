import express, { Request, Response, NextFunction } from 'express';
import { CreateVendor, GetTransactions, GetTransactionsById, GetVendor, GetVendorByID } from '../controller';

const router = express.Router();

router.post('/vendor', CreateVendor)

router.get('/getvendors', GetVendor)

router.get('/vendor/:id', GetVendorByID)


/**-----------------Transactions ----------------------- */
router.get('/transactions', GetTransactions)

router.get('/transaction/:id', GetTransactionsById)



router.get('/', (req: Request, res: Response, next: NextFunction) => {

    res.json({ message: "Hello from Vandor" })

})




export { router as AdminRoute }