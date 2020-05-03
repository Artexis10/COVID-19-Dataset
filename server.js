const express = require('express');
const mongoose = require('mongoose');
const app = express();

mongoose.connect('mongodb://localhost:27017/COVID-19', { useNewUrlParser: true, useUnifiedTopology: true });

var $maxWidthElement = $('.navbar'),
    maxWidth = $maxWidthElement.width();



app.listen(3000, ()=>{
    console.log("Server is Running on Port 3000");
});


