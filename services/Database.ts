import mongoose from 'mongoose';
import { MONGO_URI, REDIS_URL } from '../config';
import { createClient } from 'redis';

// Redis client setup
const redisClient = createClient({
    url: REDIS_URL || 'redis://localhost:6379'  // Redis URL (use default or from config)
});


export default async () => {
    try {
        await mongoose.connect(MONGO_URI)
        console.log('connected to DB');

        //redis connection
        redisClient.on('error', (err) => console.log('Redis Client Error', err));
        await redisClient.connect();
        console.log('Connected to Redis');
    } catch (err) {
        console.log('error' + err)
    }

}
export { redisClient }; 