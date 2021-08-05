const mongoose = require("mongoose");
const CountrySchema = require("./Country");

const ContinentSchema = mongoose.Schema({
  continent: {
    type: String,
    enum: [
      "Africa",
      "Asia",
      "Australia-Oceania",
      "Europe",
      "North America",
      "South America",
      "Unknown",
    ],
    default: "Unknown",
    required: true,
  },
  countries: [CountrySchema],
  cases: {
    type: Number,
    required: true,
  },
  todayCases: {
    type: Number,
    required: true,
  },
  deaths: {
    type: Number,
    required: true,
  },
  todayDeaths: {
    type: Number,
    required: true,
  },
  recovered: {
    type: Number,
    required: true,
  },
  todayRecovered: {
    type: Number,
    required: true,
  },
  active: {
    type: Number,
    required: true,
  },
  critical: {
    type: Number,
    required: true,
  },
  casesPerOneMillion: {
    type: Number,
    required: true,
  },
  deathsPerOneMillion: {
    type: Number,
    required: true,
  },
  recoveredPerOneMillion: {
    type: Number,
    required: true,
  },
  tests: {
    type: Number,
    required: true,
  },
  testsPerOneMillion: {
    type: Number,
    required: true,
  },
  population: {
    type: Number,
    required: true,
  },
  activePerOneMillion: {
    type: Number,
    required: true,
  },
  criticalPerOneMillion: {
    type: Number,
    required: true,
  },
  last_update: {
    type: Number,
    required: true,
  },
});

const Continent = mongoose.model("Continent", ContinentSchema);

module.exports = Continent;
