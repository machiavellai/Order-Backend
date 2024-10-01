import mongoose from 'mongoose';
import { MONGO_URI } from '../config';

export default async () => {
    await mongoose.connect(MONGO_URI)
        .then(result => {
            console.log('connected to DB');

        }).catch(err => console.log('error' + err))

}