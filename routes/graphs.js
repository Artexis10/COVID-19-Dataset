const express = require("express");
const router = express.Router();

router.get("/", function (req, res) {
  res.render("graphs", {
    pageTitle: "Graphs",
    stylesheet: "graphs",
    isActiveWorldwide: "inactive-link",
    isActiveContinents: "inactive-link",
    isActiveCountries: "inactive-link",
    isActiveGraphs: "active-link",
  });
});

module.exports = router;
