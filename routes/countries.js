const express = require('express');
const Continent = require('../models/Continent');
const router = express.Router();

router.get('/', function(req, res) {
    Continent.find({}, (err, continents) => {
        if (err) throw error;
        res.render('countries', {
            pageTitle: "Countries",
            stylesheet: "countries",
            activeHome: "nav-item pl-4 pl-md-0 ml-0 ml-md-4",
            activeCountries: "nav-item pl-4 pl-md-0 ml-0 ml-md-4 active",
            continents: continents
        });
    });
});

module.exports = router;