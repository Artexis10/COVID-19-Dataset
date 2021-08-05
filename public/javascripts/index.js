fetch("https://corona.lmao.ninja/v2/all?yesterday")
  .then((response) => response.json())
  .then((global) => {
    let outputConfirmed =
      '<div class="output-box"><h2 class="output" id="confirmed">Confirmed</h2> <p class="output-number" id="confirmed-number">' +
      global.cases +
      "</p></div>";
    let outputDeaths =
      '<div class="output-box"><h2 class="output" id="deaths">Deaths</h2> <p class="output-number" id="deaths-number">' +
      global.deaths +
      "</p></div>";
    let outputRecovered =
      '<div class="output-box"><h2 class="output" id="recovered">Recovered</h2> <p class="output-number" id="recovered-number">' +
      global.recovered +
      "</p></div>";
    document.getElementById("TotalConfirmed").innerHTML = outputConfirmed;
    document.getElementById("TotalDeaths").innerHTML = outputDeaths;
    document.getElementById("TotalRecovered").innerHTML = outputRecovered;
  });
