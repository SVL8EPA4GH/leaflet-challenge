// Store our API endpoint inside queryUrl
var queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

// Perform a GET request to the query URL
d3.json(queryUrl, function(data) {
  // Once we get a response, send the data.features object to the createFeatures function
  createFeatures(data.features);
});

function createFeatures(earthquakeData) {

  // Define a function we want to run once for each feature in the features array
  // Give each feature a popup describing the place and time of the earthquake
  function onEachFeature(feature, layer) {
    layer.bindPopup("<h3>" + feature.properties.place + "<hr>" + "Magnitute: " + feature.properties.mag +
      "</h3><hr><p>" + new Date(feature.properties.time) + "</p>");
  }

  // Create a GeoJSON layer containing the features array on the earthquakeData object
  // Run the onEachFeature function once for each piece of data in the array
  var earthquakes = L.geoJSON(earthquakeData, {
    onEachFeature: onEachFeature
  });

  // Sending our earthquakes layer to the createMap function
  createMap(earthquakes);
}

// Function to determine marker size based on earthquake magnitute; cf. 17-1-A09
function markerSize(mag) {
  return mag * 40;
}

// An array containing all of the information needed to create city and state markers
var loc_mag = [
  {
    coordinates: [40.7128, -74.0059],
    mag: [1]
  },
  {
    coordinates: [34.0522, -118.2437],
    mag: [2]
  },
  {
    coordinates: [41.8781, -87.6298],
    mag: [3]
  },
  {
    coordinates: [29.7604, -95.3698],
    mag: [4]
  },
  {
    coordinates: [41.2524, -95.9980],
    mag: [5]
  }
];

// Define arrays to hold created loc_mag markers
var magMarker = [];

// Loop through loc_mag markers
for (var i = 0; i < loc_mag.length; i++) {

  // Setting the marker radius for the loc_mag by passing magnitute into the markerSize function
  magMarkers.push(
    L.circle(loc_mag[i].coordinates, {
      stroke: false,
      fillOpacity: 0.75,
      color: "purple",
      fillColor: "purple",
      radius: markerSize(loc_mag[i].mag)
    })
  );
}

function createMap(earthquakes) {

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
    "Street Map": streetmap,
    "Dark Map": darkmap
  };

  // Create two separate layer groups: one for earthquaker location and one for earthquaker magnitute; cf.17-1A09
var location = L.layerGroup(locationMarkers);
var magnitute = L.layerGroup(magnitudeMarkers);



  // Create overlay object to hold our earthquaker overlay layer
  var overlayMaps = {
    Earthquakes: earthquakes
    Earthquakes: magnitute
  };


  // Create our map, giving it the streetmap and earthquakes layers to display on load
  var myMap = L.map("map", {
    center: [
      37.09, -95.71
    ],
    zoom: 5,
    layers: [streetmap, earthquakes]
  });

  // Create a layer control
  // Pass in our baseMaps and overlayMaps
  // Add the layer control to the map
  L.control.layers(baseMaps, overlayMaps, {
    collapsed: false
  }).addTo(myMap);
}
