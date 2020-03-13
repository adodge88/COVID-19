// retrieve the data from the csv file
d3.csv("assets/data/covid19.csv", function(covid19){
  console.log(covid19)

  // parse the data 
  covid19.forEach (function(data){
    // console.log(data)
    data.id_loc = parseInt(data.id_loc);
    data.confirmed_to_date = parseInt(data.confirmed_to_date);
  })

  // Create map object
  var myMap = L.map("map", {
    center: [36.8210, 5.7634],
    zoom: 2
  });

  // Add darkmap tile layer to map
  var darkmap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
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
    console.log(filteredData)

    // create marker array for the confirmed cases
    var markerArrayConfirmed = [];
    // var markerArrayDeath = [];
    // var markerArrayConfirmed = [];

    for (var i=0; i < filteredData.length ; i++){
      markerArrayConfirmed.push(
        L.circle([filteredData[i].lat, filteredData[i].long]), {
          color:"blue",
          fillColor:"blue",
          stroke: true,
          fillOpacity: 0.5,
          weight: 0.5,
          radius:filteredData[i].confirmed_to_date * 10
        })
    }

    // Add a popup with information
        // (filteredData, {
        //     onEachFeature: function onEachFeature(feature, layer) {
        //         // content = `${feature.properties.content} <br> (${Math.round(value/6 * 100)}% done with story)`
        //         // var popup = L.popup().setContent(content);
        //         // layer.bindPopup(popup);
        //         markerArray.push(layer);
        //     }
        // });

    var markerGroup = L.featureGroup(markerArrayConfirmed);
    map.fitBounds(markerGroup.getBounds()).setZoom(12);

  }

  L.control.timelineSlider({
    timelineItems: ["2020-01-22", "2020-01-25", "2020-01-29","2020-02-01","2020-02-05", "2020-02-09", "2020-02-13", "2020-02-17", "2020-02-21", "2020-02-25", "2020-02-29", "2020-03-02", "2020-03-05"],
    changeMap: getDataAddMarkers,
    // extraChangeMapParams: {exclamation: "?ADD TEXT"} 
  }).addTo(myMap);

})