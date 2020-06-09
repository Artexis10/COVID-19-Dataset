const express = require('express');
const Continent = require('../models/Continent');
const router = express.Router();

router.get('/', function(req, res) {
    Continent.find({}, (err, continents) => {
        if (err) throw error;
        var countries = [];
        for (i = 0; i < continents.length; i++) {
            for (x = 0; x < continents[i].countries.length; x++) {
                countries.push(continents[i].countries[x]);
            }
        }
        countries.sort(function(a, b){
            var x = a.country.toLowerCase();
            var y = b.country.toLowerCase();
            if (x < y) {return -1;}
            if (x > y) {return 1;}
            return 0;
          });
        res.render('countries', {
            pageTitle: "Countries",
            stylesheet: "countries",
            activeHome: "nav-item pl-4 pl-md-0 ml-0 ml-md-4",
            activeContinents: "nav-item pl-4 pl-md-0 ml-0 ml-md-4",
            activeCountries: "nav-item pl-4 pl-md-0 ml-0 ml-md-4 active",
            countries: countries
        });
    });
});

module.exports = router;