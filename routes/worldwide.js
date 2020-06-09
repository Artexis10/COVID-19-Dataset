const express = require('express');
const router = express.Router();

router.get('/', function(req, res) {
    res.render('worldwide', {
        pageTitle: "Worldwide",
        stylesheet: "worldwide",
        activeHome: "nav-item pl-4 pl-md-0 ml-0 ml-md-4 active",
        activeContinents: "nav-item pl-4 pl-md-0 ml-0 ml-md-4",
        activeCountries: "nav-item pl-4 pl-md-0 ml-0 ml-md-4"
    });
});

module.exports = router;