

// link to the eartquake feed
var link = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/2.5_week.geojson"

// var plates = "https://github.com/fraxen/tectonicplates/blob/master/GeoJSON/PB2002_boundaries.json"
// console.log(plates)

function markerSize(mag) {
  return mag * 30000;
}


// get request to pull the earthquake data
d3.json(link, function(data) {
  createFeatures(data.features);
});

// d3.json(link, function (geoJson) {
//   L.geoJSON(geoJson.features, {
//       pointToLayer: function (geoJsonPoint, latlng) {
//           return L.circleMarker(latlng, { radius: markerSize(geoJsonPoint.properties.mag) });
//       },

function createFeatures(earthquakeData) {

  var earthquakes = L.geoJSON(earthquakeData, {
  
 onEachFeature : function (feature, layer) {

  //pop up layer for earthquake detail 
    layer.bindPopup("<h3>" + feature.properties.place +
      "</h3><hr><p>" + new Date(feature.properties.time) + "</p>" + "<p> Magnitude: " +  feature.properties.mag + "</p>")
    },     pointToLayer: function (feature, latlng) {
      return new L.circle(latlng,
        {radius: markerSize(feature.properties.mag),
        fillColor: markerColor(feature.properties.mag),
        fillOpacity: 2,
        stroke: false,
    })
  }
  });
    


  createMap(earthquakes);
}

//add the color to the circles based on magnitude
function markerColor(mag) {
  if (mag <= 1) {
      return "darkgreen";
  } else if (mag <= 2) {
      return "tan";
  } else if (mag <= 3) {
      return "yellow";
  } else if (mag <= 4) {
      return "orange";
  } else if (mag <= 5) {
      return "red";
  } else {
      return "darkred";
  };
}


function createMap(earthquakes) {

  
  var satellite = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "mapbox.satellite",
    accessToken: API_KEY
  });

  var dark = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "mapbox.dark",
    accessToken: API_KEY
  });

  var baseMaps = {
    "Satellite": satellite,
    "Dark": dark
  };

 
  var overlayMaps = {
    Earthquakes: earthquakes
  };

  
  var myMap = L.map("map", {
    center: [31,-99],
    zoom: 2.5,
    layers: [satellite, earthquakes]
  });

  L.control.layers(baseMaps, overlayMaps, {
    collapsed: false
  }).addTo(myMap);

  var legend = L.control({position: 'bottomleft'});

  legend.onAdd = function () {
  
      var div = L.DomUtil.create('div', 'info legend'),
          magnitudes = [0, 1, 2, 3, 4, 5];
  
      for (var i = 0; i < magnitudes.length; i++) {
          div.innerHTML +=
              '<i style="background:' + markerColor(magnitudes[i] + 1) + '"></i> ' + 
      + magnitudes[i] + (magnitudes[i + 1] ? ' - ' + magnitudes[i + 1] + '<br>' : ' + ');
      }
  
      return div;
  };
  
  legend.addTo(myMap);

}

