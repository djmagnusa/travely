const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const placesRoutes = require('./routes/places-routes');
const usersRoutes = require('./routes/users-routes');
const HttpError = require('./models/http-error');

require('dotenv').config()

const DB = process.env.DATABASE;

const app = express();

app.use(bodyParser.json());

app.use('/api/places', placesRoutes); // /api/places/..
app.use('/api/users', usersRoutes); // /api/users/..

app.use((req, res, next) => { //only runs if no respnose was sent to one of the routes above
    const error = new HttpError('Could not find this route', 404)
    throw error;
}); 

app.use((error, req, res, next) => { //
    if(res.headerSent) {
        return next(error)
    }

    res.status(error.code || 500);
    res.json({ message: error.message || 'An unknown error occured!'});
});

mongoose
    .connect(DB)
    .then(() => {
        app.listen(5000);         
    })
    .catch(err => {
        console.log(err);
    });
