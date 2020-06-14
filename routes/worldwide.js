const express = require('express');
const Continent = require('../models/Continent');
const router = express.Router();

router.get('/', function(req, res) {
        res.render('worldwide', {
            pageTitle: "Worldwide",
            stylesheet: "worldwide",
            isActiveWorldwide: "active-link",
            isActiveContinents: "inactive-link",
            isActiveCountries: "inactive-link",
            isActiveGraphs: "inactive-link",
        });
    });

module.exports = router;