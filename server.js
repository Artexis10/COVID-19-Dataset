const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const app = express();
const databaseCreatorFunctions = require("./database-creator.js");
require("dotenv").config();

app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(bodyParser.urlencoded({ extended: true }));

// Import Routes
const indexRoute = require("./routes/index");

const worldwideRoute = require("./routes/worldwide");

const continentsRoute = require("./routes/continents");

const countriesRoute = require("./routes/countries");

const graphsRoute = require("./routes/graphs");

app.use("/", indexRoute);
app.use("/worldwide", worldwideRoute);
app.use("/continents", continentsRoute);
app.use("/countries", countriesRoute);
app.use("/graphs", graphsRoute);

app.use(function (req, res) {
  res.status(404).render("404", {
    pageTitle: "COVID-19 Statistics",
    pageNotFound: "Page Not Found!",
    stylesheet: "404",
    isActiveWorldwide: "inactive",
    isActiveContinents: "inactive",
    isActiveCountries: "inactive",
    isActiveGraphs: "inactive",
  });
});

// Middlewares
app.use("/", () => {
  console.log("Middleware running");
});

// Connecting to database
mongoose.connect(
  process.env.DB_CONNECTION,
  { useNewUrlParser: true, useUnifiedTopology: true },
  () => console.log("Connected to AtlasDB!")
);

var port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`Server is Running on Port ${port}`);
});

databaseCreatorFunctions.FetchingContinentDataFromCOVID_19_API();
