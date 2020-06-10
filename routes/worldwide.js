const express = require('express');
const router = express.Router();
const fetch = require("node-fetch");

router.get('/', function(req, res) {
    fetch('https://corona.lmao.ninja/v2/all?yesterday')
    .then(response => response.json())
    .then(global => {
        res.render('worldwide', {
            pageTitle: "Worldwide",
            stylesheet: "worldwide",
            global: global,
            isActiveWorldwide: "active-link",
            isActiveContinents: "inactive-link",
            isActiveCountries: "inactive-link",
            isActiveGraphs: "inactive-link"
        });
    });
});

module.exports = router;