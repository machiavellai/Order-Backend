import express, { Request, Response, NextFunction } from 'express'
import { GetFoodAvailability, GetFoodIn30Min, GetTopResturants, ResturantById, SearchFoods } from '../controller';
import { Authenticate } from '../middlewares';


const router = express.Router();

/** ------------------Food Availability */
router.get('/:pincode', Authenticate, GetFoodAvailability)

/** ------------------Food Availability */
router.get('/top-resturants/:pincode', GetTopResturants)
/** ------------------Food Availability */

router.get('/foods-in-30-min/:pincode', GetFoodIn30Min)
/** ------------------Food Availability */

router.get('/search/:pincode', SearchFoods)
/** ------------------Food Availability */

router.get('/resturant/:id', ResturantById)
/** ------------------Food Availability */

export { router as ShoppingRoute }