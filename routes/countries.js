const express = require("express");
const Continent = require("../models/Continent");
const router = express.Router();

router.get("/", function (req, res) {
  Continent.find({}, (err, continents) => {
    if (err) throw error;
    var countries = [];
    for (i = 0; i < continents.length; i++) {
      for (x = 0; x < continents[i].countries.length; x++) {
        countries.push(continents[i].countries[x]);
      }
    }
    countries.sort(function (a, b) {
      var x = a.country.toLowerCase();
      var y = b.country.toLowerCase();
      if (x < y) {
        return -1;
      }
      if (x > y) {
        return 1;
      }
      return 0;
    });
    res.render("countries", {
      pageTitle: "Countries",
      stylesheet: "countries",
      isActiveWorldwide: "inactive-link",
      isActiveContinents: "inactive-link",
      isActiveCountries: "active-link",
      isActiveGraphs: "inactive-link",
      countries: countries,
    });
  });
});

module.exports = router;
