const express = require("express");
const Continent = require("../models/Continent");
const router = express.Router();

router.get("/", function (req, res) {
  Continent.find({}, (err, continents) => {
    if (err) throw error;
    res.render("continents", {
      pageTitle: "Continents",
      stylesheet: "continents",
      isActiveWorldwide: "inactive-link",
      isActiveContinents: "active-link",
      isActiveCountries: "inactive-link",
      isActiveGraphs: "inactive-link",
      continents: continents,
    });
  });
});

module.exports = router;
