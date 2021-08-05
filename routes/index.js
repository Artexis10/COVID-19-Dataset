const express = require("express");
const router = express.Router();

router.get("/", function (req, res) {
  res.render("index", {
    pageTitle: "COVID-19 Statistics",
    stylesheet: "index",
  });
});

module.exports = router;
