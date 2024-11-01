import express, { Application } from 'express';
import path from 'path'
import { AdminRoute, CustomerRoute, VandorRoute } from '../routes';
import { ShoppingRoute } from '../routes/ShoppingRoute';

export default async (app: Application) => {


    app.use(express.json())
    app.use(express.urlencoded({ extended: true }))


    app.use('/images', express.static(path.join(__dirname, '../src/images')))

    app.use('/admin', AdminRoute)
    app.use('/vendor', VandorRoute)
    app.use('/Shopp', ShoppingRoute)
    app.use('/customer', CustomerRoute)

    // Catch-all for undefined routes
    app.get('*', (req, res) => {
        res.status(404).send('404 Not Found');
    });

    return app;
}

