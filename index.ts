import express from 'express'
import App from './services/ExpressApp'
import DBConnection from './services/Database'
// require('dotenv').config();

const StartServer = async () => {
    const app = express();

    await DBConnection();

    await App(app);

    app.listen(8000, () => {
        console.log('listening on port 8000');

    })
}

StartServer();