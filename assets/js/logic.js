// retrieve the data from the csv file
d3.csv("assets/data/covid19.csv", function(covid19){
  // console.log(covid19);

  // parse the data 
  covid19.forEach (function(data){
    // console.log(data)
    data.id_loc = parseInt(data.id_loc);
    data.confirmed_to_date = parseInt(data.confirmed_to_date);
    data.lat = parseFloat(data.lat);
    data.long = parseFloat(data.long);
  })

  // Create map object
  var myMap = L.map("map", {
    center: [36.8210, 5.7634],
    zoom: 2,
    scrollWheelZoom: false
  });

  // Add darkmap tile layer to map
  L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "mapbox.dark",
    accessToken: API_KEY
  }).addTo(myMap);

  //Create function to change layer with change of time slider
  getDataAddMarkers = function( {label, value, map, exclamation} ) {

    //Remove existing layer when change to time slider
    map.eachLayer(function (layer) {
      if (layer instanceof L.Marker) {
        map.removeLayer(layer);
      }
    });

    // filter the data by the "label" that in this case is the date
    var filteredData = covid19.filter(obj => {
      return obj.date === label
    })
    // console.log(filteredData);

    // create marker array for the confirmed cases
    var markerArrayConfirmed = [];

    for (var i=0; i < filteredData.length ; i++){
      if (filteredData[i].confirmed_to_date > 0) {
        markerArrayConfirmed.push(
          L.marker([filteredData[i].lat, filteredData[i].long])
          .bindPopup("<h3>" + filteredData[i].province_state + "</h3> <h3>" + 
            filteredData[i].country_region + "</h3> <hr> <h3>" + filteredData[i].date + 
            "</h3> <hr> <h3>Confirmed: " + filteredData[i].confirmed_to_date + 
            "</h3> <h3>Deaths: " + filteredData[i].deaths_to_date + 
            "</h3> <h3>Recovered: " + filteredData[i].recovered_to_date)
          .addTo(myMap)
        )
      }
    }

    // console.log(markerArrayConfirmed);

  }

  L.control.timelineSlider({
    timelineItems: ["2020-01-22", "2020-01-25", "2020-01-29","2020-02-01","2020-02-05", "2020-02-09", "2020-02-13", "2020-02-17", "2020-02-21", "2020-02-25", "2020-02-29", "2020-03-02", "2020-03-05"],
    changeMap: getDataAddMarkers,
    // extraChangeMapParams: {exclamation: "?ADD TEXT"} 
  }).addTo(myMap);


// ================== TOP SCORE CARDS ==================
// Determine the maximum date value in the data
    var maxDate = d3.max(covid19.map(d=>d.date));
    console.log("MaxDate",maxDate);

// Extract only the "rows" where date = maxDate
    var recentDate = covid19.filter(function(d){ return d.date == maxDate });

// Create empty arrays to push the data from the for loop into
    var confirmedArray = [];
    var deathArray = [];
    var recoveredArray = [];

// Loop through the data and extract all the confirmed_to_date, deaths_to_date
// and recovered_to_date values from the most recent date in the data
    for (i = 0; i < recentDate.length; i++) {
        confirmedArray.push(recentDate[i].confirmed_to_date)
        deathArray.push(recentDate[i].deaths_to_date)
        recoveredArray.push(recentDate[i].recovered_to_date)
      }
     
// Sum the arrays to obtain a total for confirmed, deaths, and arrays for the most
// recent date in the data
    var totalConfirmed = d3.sum(confirmedArray); 
    console.log("Confirmed:",totalConfirmed);
    var totalRecovered = d3.sum(deathArray); 
    console.log("Recovered:",totalRecovered);
    var totalDeaths = d3.sum(recoveredArray); 
    console.log("Deaths:",totalDeaths);


    d3.select("#confirmed-card").selectAll("div")
    .insert("h2")
    .classed("card-title card-num", true) // sets the class of the new H2
    .text(totalConfirmed);

    d3.select("#recovered-card").selectAll("div")
    .insert("h2")
    .classed("card-title card-num", true) // sets the class of the new H2
    .text(totalRecovered);

    d3.select("#death-card").selectAll("div")
    .insert("h2")
    .classed("card-title card-num", true) // sets the class of the new H2
    .text(totalDeaths);


// ================== DATA DATE ==================

d3.select("footer").selectAll("span")
.insert("p")
// .classed("card-title card-num", true) // sets the class of the new H2
.text(`Most Recent Data from: ${maxDate} [YYYY/MM/DD]`);

});

// ================== LEFT COUNT CARD ==================
// import new csv of grouped coutnries w/ total confirmed_to_date count
d3.csv("assets/data/confirmed_country_count.csv", function(data){
  // Use D3 to select the table body
  var tbody = d3.select("tbody");
  //loop through csv and push to HTML table
  data.forEach((country) =>{
      var row = tbody.append("tr");
      Object.entries(country).forEach(([key, value]) => {
          var cell = row.append("td");
          cell.text(value);
      });
  });
});