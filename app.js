const express = require('express');
const morgan = require('morgan'); //a middleware that logs our request
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const path = require('path')

const app = express();

const gamesRoutes = require('./api/routes/games');
const ordersRoutes = require('./api/routes/orders');
const usersRoutes = require('./api/routes/user');

// CONNECT TO DATEBASE
mongoose.connect('mongodb://localhost:27017/gamesandfriends', { useNewUrlParser: true });

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/public/views/home/home.html');
});
app.get('/upload', (req, res) => {
    res.sendFile(__dirname + '/public/views/upload/upload.html');
}); 
app.get('/signup', (req, res) => {
    res.sendFile(__dirname + '/public/views/signup/signup.html');
}); 
app.get('/login', (req, res) => {
    res.sendFile(__dirname + '/public/views/login/login.html');
}); 

// Middleware for:
// log our request
app.use(morgan('dev'));
app.use('/uploads', express.static('uploads'))
app.use(express.static(path.join(__dirname, 'public')));
//app.use(express.static('public'));
app.use(bodyParser.urlencoded({extended: false})); // will extract urlencoded data and make it readable 
app.use(bodyParser.json()) // will extract json data and make it readable 

// handle cors errors. (Cross-Origin Resource Sharing) (avoids the browser holding back data)
// cors errors is a security methods enforce by the browsers
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*'); // gives access to every client
    res.header('Access-Control-Allow-Headers', '*');
    
    if (req.method === 'OPTIONS'){
        res.header('Access-Control-Allow-Methods', 'GET, PUT, POST, PATCH, DELETE');
        return res.status(200).json({});
    }
    next(); // goes to the other routes below
});

// routes for request handling 
app.use('/games', gamesRoutes); // a filter that says. only request that start with /games will be handle by an requesthandler. (filter, requesthandler)
app.use('/orders', ordersRoutes);
app.use('/user', usersRoutes);

// if you reach this, then no correct route was used
app.use((req, res, next) => {
    const error = Error('Page not found');
    error.status = 404;
    next(error); //forward the error to the next app.use middleware
}); 

app.use((error, req, res, next) => {
    res.status(error.status || 500);
    res.json({
        error: {
            message: error.message
        }
    });
});

module.exports = app;