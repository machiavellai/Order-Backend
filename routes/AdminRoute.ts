import express, { Request, Response, NextFunction } from 'express';
import { CreateVandor } from '../controller';

const router = express.Router();

router.post('/vendor', CreateVandor)

router.get('/', (req: Request, res: Response, next: NextFunction) => {

    res.json({ message: "Hello from Vandor" })

})



export { router as AdminRoute }