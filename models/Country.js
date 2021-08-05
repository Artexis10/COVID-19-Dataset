const mongoose = require("mongoose");

const CountrySchema = mongoose.Schema({
  country: {
    type: String,
    required: true,
  },
  countryInfo: {
    iso2: {
      type: String,
      required: false,
    },
    iso3: {
      type: String,
      required: false,
    },
    lat: {
      type: Number,
      required: true,
    },
    long: {
      type: Number,
      required: true,
    },
    flag: {
      type: String,
      required: true,
      validate: {
        validator: function (text) {
          return text.indexOf("https://disease.sh/assets/img/flags/") === 0;
        },
        message:
          "Flag URL must contain the following domain: https://disease.sh/assets/img/flags/",
      },
    },
  },
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
  continent: {
    type: String,
    enum: [
      "Africa",
      "Asia",
      "Australia/Oceania",
      "Europe",
      "North America",
      "South America",
      "Unknown",
    ],
    default: "Unknown",
    required: true,
  },
  oneCasePerPeople: {
    type: Number,
    required: true,
  },
  oneDeathPerPeople: {
    type: Number,
    required: true,
  },
  oneTestPerPeople: {
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

module.exports = CountrySchema;
