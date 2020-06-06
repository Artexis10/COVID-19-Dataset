const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const app = express();
const path = require('path');
const Continent = require('./models/Continent');
const CountrySchema = require('./models/Country');
const Country = mongoose.model('Country', CountrySchema);
const fetch = require("node-fetch");
require('dotenv/config');

app.set('view engine', 'ejs');  
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({ extended: true }));

// Import Routes
const indexRoute = require('./routes/index');

const countriesRoute = require('./routes/countries');

app.use('/', indexRoute);
app.use('/countries', countriesRoute);

app.use(function(req, res){
    res.status(404).render('404', {
        pageTitle: "COVID-19 Statistics",
        pageNotFound: "Page Not Found!",
        stylesheet: "404",
        activeHome: "nav-item pl-4 pl-md-0 ml-0 ml-md-4",
        activeCountries: "nav-item pl-4 pl-md-0 ml-0 ml-md-4"
    });
});

// Middlewares
app.use('/', () => {
    console.log('Middleware running');
});

// Connecting to database
mongoose.connect(
    process.env.DB_CONNECTION, 
    { useNewUrlParser: true, useUnifiedTopology: true },
    () => console.log('Connected to AtlasDB!')
);

app.listen(3000, () => {
    console.log("Server is Running on Port 3000");
});

function FetchingContinentDataFromCOVID_19_API() {
    fetch('https://corona.lmao.ninja/v2/continents?yesterday=true&sort')
    .then(response => response.json())
    .then(list_of_continents => {  
        var continent_length = 0;
        let query = Continent.countDocuments({}, (err, count) => {return count;});
        query.exec().then((count) => {
            continent_length = count;
        if (continent_length === 0) {
            InsertingDocumentsToContinentCollection(list_of_continents);
        }
        else if (continent_length === list_of_continents.length + 1 || continent_length < list_of_continents.length + 1) {
            var continents_arr = [];
            let queryData = Continent.find({}, (err, continents) => {return continents;});
            queryData.exec().then((continents) => {
                continents_arr = continents;
                //console.log(continents_arr);
            for (i = 0; i < list_of_continents.length; i++) { 
                if (list_of_continents[i].updated > Date.parse(continents_arr[i].last_update)) {
                    Continent.updateOne(
                    { continent: list_of_continents[i].continent },
                    {
                        $set: { cases: list_of_continents[i].cases,
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
                                last_update: new Date(list_of_continents[i].updated)
                            }
                    },
                    { upsert: true }
                    );
                }
            };
            }).catch((error) => {
                console.log(error);
            });
        }
        else if (continent_length > list_of_continents.length + 1) {
            mongoose.connection.db.dropCollection('continents', function(err, result) {
                console.log('Database dropped: ' + result);
                InsertingDocumentsToContinentCollection(list_of_continents);
            });
        }
        }).catch((error) => {
            console.log(error);
        });
        FetchingCountryDataFromCOVID_19_API();
    })
    .catch(function(error){
        return console.log(error);
    });
};

function InsertingDocumentsToContinentCollection(list_of_continents) {
    var continent_arr = [];
    for (i = 0; i < list_of_continents.length; i++){
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
            last_update: new Date(list_of_continents[i].updated)
        });
        continent_arr.push(continent);
    };
    const empty_continent = new Continent({
        continent: 'Unknown',
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
        last_update: new Date()
    });
    continent_arr.push(empty_continent);
    continent_arr.sort(function(a, b) {
        var x = a.continent.toLowerCase();
        var y = b.continent.toLowerCase();
        if (x < y) {return -1;}
        if (x > y) {return 1;}
        return 0;
    });
    Continent.insertMany(continent_arr);
}

function FetchingCountryDataFromCOVID_19_API() {
    fetch('https://corona.lmao.ninja/v2/countries?yesterday&sort')
    .then(response => response.json())
    .then(list_of_countries => {
        var continents_arr = [];
        var countries_length = 0;
        let query = Continent.find({ }, (err, continents) => {return continents;});
        query.exec().then((continents) => {
            continents_arr = continents;
        for (i = 0; i < continents_arr.length; i++) {
            countries_length += continents_arr[i].countries.length;
        }
        if (countries_length === 0) {
            InsertingCountriesToContinentCollection(list_of_countries, continents_arr);
        }
        else if (countries_length === list_of_countries.length || countries_length < list_of_countries.length) {
            for (i = 0; i < list_of_countries.length; i++) { 
                var indexForContinent;
                if (list_of_countries[i].continent === '') {
                    indexForContinent = continents_arr.findIndex(continents => {
                        return continents.continent === 'Unknown';
                    });
                } else {
                    indexForContinent = continents_arr.findIndex(continents => {
                        return continents.continent === list_of_countries[i].continent;
                    });
                }

                var indexForCountry = continents_arr[indexForContinent].countries.findIndex(countries => {
                    return countries.country === list_of_countries[i].country;
                });

                if (list_of_countries[i].updated > Date.parse(continents_arr[indexForContinent].countries[indexForCountry].updated)) {
                    Continent.updateOne(
                    { continent: list_of_countries[i].continent },
                    {
                        $set: { country: list_of_countries[i].country,
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
                                last_update: new Date(list_of_countries[i].updated)
                             }
                    },
                    { upsert: true }, () => console.log('Successful')
                    );
                }
                else if (list_of_countries[i].updated > Date.parse(continents_arr[indexForContinent].countries[indexForCountry].updated) && list_of_continents[i].continent === '') {
                    Continent.updateOne(
                    { continent: 'Unknown' },
                    {
                        $set: { country: list_of_countries[i].country,
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
                                continent: 'Unknown',
                                oneCasePerPeople: list_of_countries[i].oneCasePerPeople,
                                oneDeathPerPeople: list_of_countries[i].oneDeathPerPeople,
                                oneTestPerPeople: list_of_countries[i].oneTestPerPeople,
                                activePerOneMillion: list_of_countries[i].activePerOneMillion,
                                criticalPerOneMillion: list_of_countries[i].criticalPerOneMillion,
                                last_update: new Date(list_of_countries[i].updated)
                             }
                    },
                    { upsert: true }, () => console.log('Successful')
                    );
                }
            };
        }
        else if (country_length > list_of_countries.length) {
            mongoose.connection.db.dropCollection('continents', function(err, result) {
                console.log('Database dropped: ' + result);
                InsertingCountriesToContinentCollection(list_of_continents, continents_arr);
            });
        }
        }).catch((error) => {
            console.log(error);
        });
    })
    .catch(function(error){
        return console.log(error);
    });
};

function InsertingCountriesToContinentCollection(list_of_countries, continents_arr) {
    var countries_arr = {};
            for (i = 0; i < continents_arr.length; i++) {
                countries_arr[continents_arr[i].continent] = [];
            }
            countries_arr['Unknown'] = [];
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
                    last_update: new Date(list_of_countries[i].updated)
                });

                if (list_of_countries[i].continent === '') {
                    country.continent = 'Unknown';
                    countries_arr['Unknown'].push(country);
                } else {
                    countries_arr[list_of_countries[i].continent].push(country);
                }
            };

            for (i = 0; i < continents_arr.length; i++) {
                Continent.updateMany({continent: continents_arr[i].continent}, { $push: {countries: countries_arr[continents_arr[i].continent]} }, function(error){
                    if(error) {
                        console.log(error);
                        console.log("Record failed to update.");
                    } else {
                        console.log("Record successfully updated.");
                    }
                });
            }
}

/*
var utcDate = new Date(1591231059980);

console.log(utcDate.toString());
*/

FetchingContinentDataFromCOVID_19_API();