
// Funtion to scale the marker size
function  markerSize (mag) {
  return mag*50000;
};
// Creating map object
var myMap = L.map("map", {
  center: [40.7, -73.95],
  zoom: 11
});

// retrieve the data from the csv file
d3.csv("assets/data/covid19.csv", function(covid19){
  label='2020-01-22'
  // console.log(covid19)
  // parse the data 
  covid19.forEach (function(data){
    // console.log(data)
    data.id_loc = parseInt(data.id_loc)
  })

  // filter the data by the "label" that in this case is the date
  var filteredData = covid19.filter(obj => {
    return obj.date === label
  })
  // console.log(filteredData)

  // create corresponding marker arrays for the three classes
  var markerArrayRecovered = [];
  var markerArrayDeath = [];
  var markerArrayConfirmed = [];

  for (var i=0; i < filteredData.length ; i++){
    markerArrayRecovered.push(
      L.circle([filteredData[i].lat, filteredData[i].long]), {
      color:"green",
      fillColor:"green",
      stroke: true,
      fillOpacity: 0.5,
      weight: 0.5,
      radius:filteredData[i].recovered_to_date
    })
    markerArrayDeath.push(
      L.circle([filteredData[i].lat, filteredData[i].long]), {
      color:"red",
      fillColor:"red",
      stroke: true,
      fillOpacity: 0.5,
      weight: 0.5,
      radius:filteredData[i].death_to_date
    });
    markerArrayConfirmed.push(
      L.circle([filteredData[i].lat, filteredData[i].long]), {
      color:"blue",
      fillColor:"blue",
      stroke: true,
      fillOpacity: 0.5,
      weight: 0.5,
      radius:filteredData[i].confirmed_to_date
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
      
    var markerGroup = L.featureGroup(markerArrayRecovered,markerArrayDeath,markerArrayConfirmed );
    L.control.timelineSlider({
      timelineItems: covid19.date, 
      changeMap: getDataAddMarkers,
      // extraChangeMapParams: {exclamation: "?ADD TEXT"} 
    })
  // .addTo(mymap);   
      
    createMap(covid19)
})
  


function createMap(covid19) {
  // Define streetmap and darkmap layers
  var streetmap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "mapbox.streets",
    accessToken: API_KEY
  });
  var darkmap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "mapbox.dark",
    accessToken: API_KEY
  });
  // Define a baseMaps object to hold our base layers
  var baseMaps = {
    "Dark Map": darkmap,
    "Ligth Map": streetmap
  };
  // Create overlay object to hold our overlay layer
  var overlayMaps = {
    TotalCases: covid19
  };
  // Create our map, giving it the streetmap and cumulative cases(covid19) layers to display on load
  var myMap = L.map("map", {
    center: [
      37.09, -95.71
    ],
    zoom: 2,
    layers: [darkmap, covid19]
  });
  // Create a layer control
  // Pass in our baseMaps and overlayMaps
  // Add the layer control to the map
  L.control.layers(baseMaps, overlayMaps, {
    collapsed: false
  }).addTo(myMap);
}
