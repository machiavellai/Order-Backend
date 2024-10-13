import express from 'express'
import App from './services/ExpressApp'
import DBConnection from './services/Database'
import { PORT } from './config';
// require('dotenv').config();

const StartServer = async () => {
    const app = express();

    await DBConnection();

    await App(app);

    app.listen(PORT, () => {
        console.log(`listening on port ${PORT}`);

    })
}

StartServer();