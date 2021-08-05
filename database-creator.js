const mongoose = require("mongoose");
const Continent = require("./models/Continent");
const CountrySchema = require("./models/Country");
const Country = mongoose.model("Country", CountrySchema);
const fetch = require("node-fetch");

function FetchingContinentDataFromCOVID_19_API() {
  fetch("https://corona.lmao.ninja/v2/continents?yesterday=true&sort")
    .then((response) => response.json())
    .then((list_of_continents) => {
      var continents_arr;
      var continent_length = 0;
      var query = Continent.countDocuments({}, (err, count) => {
        return count;
      });
      query
        .exec()
        .then((count) => {
          continent_length = count;
          var queryData = Continent.find({}, (err, continents) => {
            return continents;
          });
          queryData
            .exec()
            .then((continents) => {
              continents_arr = continents;
              if (continent_length === 0) {
                continents_arr =
                  InsertingDocumentsToContinentCollection(list_of_continents);
                FetchingCountryDataFromCOVID_19_API(continents_arr);
              } else if (
                continent_length === list_of_continents.length + 1 ||
                continent_length < list_of_continents.length + 1
              ) {
                for (i = 0; i < list_of_continents.length; i++) {
                  let lastUpdate =
                    continents_arr[i] && continents_arr[i].last_update;
                  if (list_of_continents[i].updated > lastUpdate + 599999) {
                    Continent.updateOne(
                      { continent: list_of_continents[i].continent },
                      {
                        $set: {
                          continent: list_of_continents[i].continent,
                          cases: list_of_continents[i].cases,
                          todayCases: list_of_continents[i].todayCases,
                          deaths: list_of_continents[i].deaths,
                          todayDeaths: list_of_continents[i].todayDeaths,
                          recovered: list_of_continents[i].recovered,
                          todayRecovered: list_of_continents[i].todayRecovered,
                          active: list_of_continents[i].active,
                          critical: list_of_continents[i].critical,
                          casesPerOneMillion:
                            list_of_continents[i].casesPerOneMillion,
                          deathsPerOneMillion:
                            list_of_continents[i].deathsPerOneMillion,
                          recoveredPerOneMillion:
                            list_of_continents[i].recoveredPerOneMillion,
                          tests: list_of_continents[i].tests,
                          testsPerOneMillion:
                            list_of_continents[i].testsPerOneMillion,
                          population: list_of_continents[i].population,
                          activePerOneMillion:
                            list_of_continents[i].activePerOneMillion,
                          criticalPerOneMillion:
                            list_of_continents[i].criticalPerOneMillion,
                          last_update: list_of_continents[i].updated,
                        },
                      },
                      { upsert: true },
                      function (err, res) {
                        if (err) throw err;
                        console.log("Continent successfully updated");
                      }
                    );
                  }
                }
                FetchingCountryDataFromCOVID_19_API(continents_arr);
              } else if (continent_length > list_of_continents.length + 1) {
                mongoose.connection.db.dropCollection(
                  "continents",
                  function (err, result) {
                    console.log("Database dropped: " + result);
                    continents_arr =
                      InsertingDocumentsToContinentCollection(
                        list_of_continents
                      );
                  }
                );
                FetchingCountryDataFromCOVID_19_API(continents_arr);
              }
            })
            .catch((error) => {
              console.log(error);
            });
        })
        .catch((error) => {
          console.log(error);
        });
    })
    .catch(function (error) {
      return console.log(error);
    });
}

function InsertingDocumentsToContinentCollection(list_of_continents) {
  var continents_arr = [];
  for (i = 0; i < list_of_continents.length; i++) {
    const continent = new Continent({
      continent: list_of_continents[i].continent,
      countries: [],
      cases: list_of_continents[i].cases,
      todayCases: list_of_continents[i].todayCases,
      deaths: list_of_continents[i].deaths,
      todayDeaths: list_of_continents[i].todayDeaths,
      recovered: list_of_continents[i].recovered,
      todayRecovered: list_of_continents[i].todayRecovered,
      active: list_of_continents[i].active,
      critical: list_of_continents[i].critical,
      casesPerOneMillion: list_of_continents[i].casesPerOneMillion,
      deathsPerOneMillion: list_of_continents[i].deathsPerOneMillion,
      recoveredPerOneMillion: list_of_continents[i].recoveredPerOneMillion,
      tests: list_of_continents[i].tests,
      testsPerOneMillion: list_of_continents[i].testsPerOneMillion,
      population: list_of_continents[i].population,
      activePerOneMillion: list_of_continents[i].activePerOneMillion,
      criticalPerOneMillion: list_of_continents[i].criticalPerOneMillion,
      last_update: list_of_continents[i].updated,
    });
    continents_arr.push(continent);
  }
  const empty_continent = new Continent({
    continent: "Unknown",
    countries: [],
    cases: 0,
    todayCases: 0,
    deaths: 0,
    todayDeaths: 0,
    recovered: 0,
    todayRecovered: 0,
    active: 0,
    critical: 0,
    casesPerOneMillion: 0,
    deathsPerOneMillion: 0,
    recoveredPerOneMillion: 0,
    tests: 0,
    testsPerOneMillion: 0,
    population: 0,
    activePerOneMillion: 0,
    criticalPerOneMillion: 0,
    last_update: new Date().getTime(),
  });
  continents_arr.push(empty_continent);
  continents_arr.sort(function (a, b) {
    var x = a.continent.toLowerCase();
    var y = b.continent.toLowerCase();
    if (x < y) {
      return -1;
    }
    if (x > y) {
      return 1;
    }
    return 0;
  });
  Continent.insertMany(continents_arr);
  return continents_arr;
}

function FetchingCountryDataFromCOVID_19_API(continents_arr) {
  fetch("https://corona.lmao.ninja/v2/countries?yesterday&sort")
    .then((response) => response.json())
    .then((list_of_countries) => {
      var countries_length = 0;
      for (i = 0; i < continents_arr.length; i++) {
        countries_length += continents_arr[i].countries.length;
      }
      if (countries_length === 0) {
        InsertingCountriesToContinentCollection(
          list_of_countries,
          continents_arr
        );
      } else if (
        countries_length === list_of_countries.length ||
        countries_length < list_of_countries.length
      ) {
        for (i = 0; i < list_of_countries.length; i++) {
          if (list_of_countries[i].continent === "") {
            indexForContinent = continents_arr.findIndex((continents) => {
              return continents.continent === "Unknown";
            });
          } else {
            indexForContinent = continents_arr.findIndex((continents) => {
              return continents.continent === list_of_countries[i].continent;
            });
          }

          var indexForCountry = continents_arr[
            indexForContinent
          ].countries.findIndex((countries) => {
            return countries.country === list_of_countries[i].country;
          });

          if (
            list_of_countries[i].updated >
              continents_arr[indexForContinent].countries[indexForCountry]
                .last_update &&
            continents_arr[indexForContinent].continent !== "Unknown"
          ) {
            Continent.updateOne(
              { "countries.country": list_of_countries[i].country },
              {
                $set: {
                  "countries.$.country": list_of_countries[i].country,
                  "countries.$.countryInfo.iso2":
                    list_of_countries[i].countryInfo.iso2,
                  "countries.$.countryInfo.iso3":
                    list_of_countries[i].countryInfo.iso3,
                  "countries.$.countryInfo.lat":
                    list_of_countries[i].countryInfo.lat,
                  "countries.$.countryInfo.long":
                    list_of_countries[i].countryInfo.long,
                  "countries.$.countryInfo.flag":
                    list_of_countries[i].countryInfo.flag,
                  "countries.$.cases": list_of_countries[i].cases,
                  "countries.$.todayCases": list_of_countries[i].todayCases,
                  "countries.$.deaths": list_of_countries[i].deaths,
                  "countries.$.todayDeaths": list_of_countries[i].todayDeaths,
                  "countries.$.recovered": list_of_countries[i].recovered,
                  "countries.$.todayRecovered":
                    list_of_countries[i].todayRecovered,
                  "countries.$.active": list_of_countries[i].active,
                  "countries.$.critical": list_of_countries[i].critical,
                  "countries.$.casesPerOneMillion":
                    list_of_countries[i].casesPerOneMillion,
                  "countries.$.deathsPerOneMillion":
                    list_of_countries[i].deathsPerOneMillion,
                  "countries.$.recoveredPerOneMillion":
                    list_of_countries[i].recoveredPerOneMillion,
                  "countries.$.tests": list_of_countries[i].tests,
                  "countries.$.testsPerOneMillion":
                    list_of_countries[i].testsPerOneMillion,
                  "countries.$.population": list_of_countries[i].population,
                  "countries.$.continent": list_of_countries[i].continent,
                  "countries.$.oneCasePerPeople":
                    list_of_countries[i].oneCasePerPeople,
                  "countries.$.oneDeathPerPeople":
                    list_of_countries[i].oneDeathPerPeople,
                  "countries.$.oneTestPerPeople":
                    list_of_countries[i].oneTestPerPeople,
                  "countries.$.activePerOneMillion":
                    list_of_countries[i].activePerOneMillion,
                  "countries.$.criticalPerOneMillion":
                    list_of_countries[i].criticalPerOneMillion,
                  "countries.$.last_update": list_of_countries[i].updated,
                },
              },
              { upsert: true },
              function (err, res) {
                if (err) throw err;
                else console.log("Country successfully updated");
              }
            );
          } else if (
            list_of_countries[i].updated >
              continents_arr[indexForContinent].countries[indexForCountry]
                .last_update &&
            continents_arr[indexForContinent].continent === "Unknown"
          ) {
            Continent.updateOne(
              { "countries.country": list_of_countries[i].country },
              {
                $set: {
                  "countries.$.country": list_of_countries[i].country,
                  "countries.$.countryInfo.iso2":
                    list_of_countries[i].countryInfo.iso2,
                  "countries.$.countryInfo.iso3":
                    list_of_countries[i].countryInfo.iso3,
                  "countries.$.countryInfo.lat":
                    list_of_countries[i].countryInfo.lat,
                  "countries.$.countryInfo.long":
                    list_of_countries[i].countryInfo.long,
                  "countries.$.countryInfo.flag":
                    list_of_countries[i].countryInfo.flag,
                  "countries.$.cases": list_of_countries[i].cases,
                  "countries.$.todayCases": list_of_countries[i].todayCases,
                  "countries.$.deaths": list_of_countries[i].deaths,
                  "countries.$.todayDeaths": list_of_countries[i].todayDeaths,
                  "countries.$.recovered": list_of_countries[i].recovered,
                  "countries.$.todayRecovered":
                    list_of_countries[i].todayRecovered,
                  "countries.$.active": list_of_countries[i].active,
                  "countries.$.critical": list_of_countries[i].critical,
                  "countries.$.casesPerOneMillion":
                    list_of_countries[i].casesPerOneMillion,
                  "countries.$.deathsPerOneMillion":
                    list_of_countries[i].deathsPerOneMillion,
                  "countries.$.recoveredPerOneMillion":
                    list_of_countries[i].recoveredPerOneMillion,
                  "countries.$.tests": list_of_countries[i].tests,
                  "countries.$.testsPerOneMillion":
                    list_of_countries[i].testsPerOneMillion,
                  "countries.$.population": list_of_countries[i].population,
                  "countries.$.continent": "Unknown",
                  "countries.$.oneCasePerPeople":
                    list_of_countries[i].oneCasePerPeople,
                  "countries.$.oneDeathPerPeople":
                    list_of_countries[i].oneDeathPerPeople,
                  "countries.$.oneTestPerPeople":
                    list_of_countries[i].oneTestPerPeople,
                  "countries.$.activePerOneMillion":
                    list_of_countries[i].activePerOneMillion,
                  "countries.$.criticalPerOneMillion":
                    list_of_countries[i].criticalPerOneMillion,
                  "countries.$.last_update": list_of_countries[i].updated,
                },
              },
              { upsert: true },
              function (err, res) {
                if (err) throw err;
                else console.log("Country successfully updated");
              }
            );
          }
        }
        var indexForContinent = continents_arr.findIndex((continents) => {
          return continents.continent === "Unknown";
        });

        Continent.aggregate([
          { $match: { continent: "Unknown" } },
          { $unwind: "$countries" },
          {
            $group: {
              _id: "$country",
              cases: { $sum: "$countries.cases" },
              todayCases: { $sum: "$countries.todayCases" },
              deaths: { $sum: "$countries.deaths" },
              todayDeaths: { $sum: "$countries.todayDeaths" },
              recovered: { $sum: "$countries.recovered" },
              todayRecovered: { $sum: "$countries.todayRecovered" },
              active: { $sum: "$countries.active" },
              critical: { $sum: "$countries.critical" },
              casesPerOneMillion: { $sum: "$countries.casesPerOneMillion" },
              deathsPerOneMillion: { $sum: "$countries.deathsPerOneMillion" },
              recoveredPerOneMillion: {
                $sum: "$countries.recoveredPerOneMillion",
              },
              tests: { $sum: "$countries.tests" },
              testsPerOneMillion: { $sum: "$countries.testsPerOneMillion" },
              population: { $sum: "$countries.population" },
              activePerOneMillion: { $sum: "$countries.activePerOneMillion" },
              criticalPerOneMillion: {
                $sum: "$countries.criticalPerOneMillion",
              },
            },
          },
        ]).then(function (unknownContinent) {
          console.log(unknownContinent);
          var unknownContinent;

          Continent.updateOne(
            { continent: continents_arr[indexForContinent].continent },
            {
              $set: {
                continent: continents_arr[indexForContinent].continent,
                cases: unknownContinent[0].cases,
                todayCases: unknownContinent[0].todayCases,
                deaths: unknownContinent[0].deaths,
                todayDeaths: unknownContinent[0].todayDeaths,
                recovered: unknownContinent[0].recovered,
                todayRecovered: unknownContinent[0].todayRecovered,
                active: unknownContinent[0].active,
                critical: unknownContinent[0].critical,
                casesPerOneMillion: unknownContinent[0].casesPerOneMillion,
                deathsPerOneMillion: unknownContinent[0].deathsPerOneMillion,
                recoveredPerOneMillion:
                  unknownContinent[0].recoveredPerOneMillion,
                tests: unknownContinent[0].tests,
                testsPerOneMillion: unknownContinent[0].testsPerOneMillion,
                population: unknownContinent[0].population,
                activePerOneMillion: unknownContinent[0].activePerOneMillion,
                criticalPerOneMillion:
                  unknownContinent[0].criticalPerOneMillion,
                last_update: new Date().getTime(),
              },
            },
            { upsert: true },
            function (err, res) {
              if (err) throw err;
              else console.log("Country successfully updated");
            }
          );
        });
      } else if (country_length > list_of_countries.length) {
        mongoose.connection.db.dropCollection(
          "continents",
          function (err, result) {
            console.log("Database dropped: " + result);
            InsertingCountriesToContinentCollection(
              list_of_continents,
              continents_arr
            );
          }
        );
      }
    })
    .catch((error) => {
      console.log(error);
    });
}

function InsertingCountriesToContinentCollection(
  list_of_countries,
  continents_arr
) {
  var countries_arr = {};
  for (i = 0; i < continents_arr.length; i++) {
    countries_arr[continents_arr[i].continent] = [];
  }
  console.log(countries_arr);
  for (i = 0; i < list_of_countries.length; i++) {
    const country = new Country({
      country: list_of_countries[i].country,
      countryInfo: list_of_countries[i].countryInfo,
      cases: list_of_countries[i].cases,
      todayCases: list_of_countries[i].todayCases,
      deaths: list_of_countries[i].deaths,
      todayDeaths: list_of_countries[i].todayDeaths,
      recovered: list_of_countries[i].recovered,
      todayRecovered: list_of_countries[i].todayRecovered,
      active: list_of_countries[i].active,
      critical: list_of_countries[i].critical,
      casesPerOneMillion: list_of_countries[i].casesPerOneMillion,
      deathsPerOneMillion: list_of_countries[i].deathsPerOneMillion,
      recoveredPerOneMillion: list_of_countries[i].recoveredPerOneMillion,
      tests: list_of_countries[i].tests,
      testsPerOneMillion: list_of_countries[i].testsPerOneMillion,
      population: list_of_countries[i].population,
      continent: list_of_countries[i].continent,
      oneCasePerPeople: list_of_countries[i].oneCasePerPeople,
      oneDeathPerPeople: list_of_countries[i].oneDeathPerPeople,
      oneTestPerPeople: list_of_countries[i].oneTestPerPeople,
      activePerOneMillion: list_of_countries[i].activePerOneMillion,
      criticalPerOneMillion: list_of_countries[i].criticalPerOneMillion,
      last_update: list_of_countries[i].updated,
    });
    if (list_of_countries[i].continent === "") {
      country.continent = "Unknown";
      countries_arr["Unknown"].push(country);
      Continent.updateOne(
        { continent: "Unknown" },
        {
          $inc: {
            cases: list_of_countries[i].cases,
            todayCases: list_of_countries[i].todayCases,
            deaths: list_of_countries[i].deaths,
            todayDeaths: list_of_countries[i].todayDeaths,
            recovered: list_of_countries[i].recovered,
            todayRecovered: list_of_countries[i].todayRecovered,
            active: list_of_countries[i].active,
            critical: list_of_countries[i].critical,
            casesPerOneMillion: list_of_countries[i].casesPerOneMillion,
            deathsPerOneMillion: list_of_countries[i].deathsPerOneMillion,
            recoveredPerOneMillion: list_of_countries[i].recoveredPerOneMillion,
            tests: list_of_countries[i].tests,
            testsPerOneMillion: list_of_countries[i].testsPerOneMillion,
            population: list_of_countries[i].population,
            activePerOneMillion: list_of_countries[i].activePerOneMillion,
            criticalPerOneMillion: list_of_countries[i].criticalPerOneMillion,
          },
        },
        { upsert: true },
        function (err, res) {
          if (err) throw err;
          console.log("Continent successfully inserted");
        }
      );
    } else {
      countries_arr[list_of_countries[i].continent].push(country);
    }
  }
  console.log(continents_arr);

  for (i = 0; i < continents_arr.length; i++) {
    Continent.updateMany(
      { continent: continents_arr[i].continent },
      { $push: { countries: countries_arr[continents_arr[i].continent] } },
      function (error) {
        if (error) {
          console.log(error);
          console.log("Failed to insert countries to the continent");
        } else {
          console.log("Successfully inserted countries to the continent");
        }
      }
    );
  }
}

module.exports.FetchingContinentDataFromCOVID_19_API =
  FetchingContinentDataFromCOVID_19_API;
