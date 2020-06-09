const express = require('express');
const Continent = require('../models/Continent');
const router = express.Router();

router.get('/', function(req, res) {
    Continent.find({}, (err, continents) => {
        if (err) throw error;
        res.render('continents', {
            pageTitle: "Continents",
            stylesheet: "continents",
            activeHome: "nav-item pl-4 pl-md-0 ml-0 ml-md-4",
            activeContinents: "nav-item pl-4 pl-md-0 ml-0 ml-md-4 active",
            activeCountries: "nav-item pl-4 pl-md-0 ml-0 ml-md-4",
            continents: continents
        });
    });
});

module.exports = router;