const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const app = express();
const path = require('path');
require('dotenv/config');

app.set('view engine', 'ejs');  
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({ extended: true }));

// Import Routes
const indexRoute = require('./routes/index');

const countriesRoute = require('./routes/countries');

app.use('/', indexRoute);
app.use('/countries', countriesRoute);

// Middlewares
app.use('/', () => {
    console.log('Middleware running');
});

// Connecting to database
mongoose.connect(
    process.env.DB_CONNECTION, 
    { useNewUrlParser: true, useUnifiedTopology: true },
    () => console.log('Connected to AtlasDB!')
);

app.listen(3000, () => {
    console.log("Server is Running on Port 3000");
});


