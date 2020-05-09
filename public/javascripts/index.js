fetch('https://api.covid19api.com/world/total')
    .then(response => response.json())
    .then(total => {
        let outputConfirmed = '<div class="output-box"><h2 class="output" id="confirmed">Confirmed</h2> <p class="output-number" id="confirmed-number">' + total.TotalConfirmed + '</p></div>'; 
        let outputDeaths = '<div class="output-box"><h2 class="output" id="deaths">Deaths</h2> <p class="output-number" id="deaths-number">' + total.TotalDeaths + '</p></div>';
        let outputRecovered = '<div class="output-box"><h2 class="output" id="recovered">Recovered</h2> <p class="output-number" id="recovered-number">' + total.TotalRecovered + '</p></div>';               
        document.getElementById("TotalConfirmed").innerHTML = outputConfirmed;
        document.getElementById("TotalDeaths").innerHTML = outputDeaths;
        document.getElementById("TotalRecovered").innerHTML = outputRecovered;
});