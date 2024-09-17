import express from 'express';

import { AdminRoute, VandorRoute } from './routes';


const app = express();


app.use('/admin', AdminRoute)
app.use('/vendor', VandorRoute)

app.listen(8000, () => {
    console.log(`Listening to port 8000`);
})