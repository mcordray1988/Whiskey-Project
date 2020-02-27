var darkMap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "mapbox.dark",
    accessToken: API_KEY,
});

var layers = {
  HIGHLY_RATED: new L.LayerGroup(),
  ABOVE_AVG: new L.LayerGroup(),
  AVG: new L.LayerGroup(),
  LOW_RATING: new L.LayerGroup()
};

var map = L.map("map", {
  center: [38.0406, -84.5037], // <---- LEXINGTON  
  zoom: 9,
  layers: [
    layers.HIGHLY_RATED,
    layers.ABOVE_AVG,
    layers.AVG,
    layers.LOW_RATING
  ]
});

darkMap.addTo(map);

var overlays = {
  "Highly Rated": layers.HIGHLY_RATED,
  "Above Average": layers.ABOVE_AVG,
  "Average": layers.AVG,
  "Low Rating": layers.LOW_RATING,
};

L.control.layers(null, overlays).addTo(map);

var icons = {
  HIGHLY_RATED: L.ExtraMarkers.icon({
    icon: "fas fa-glass-whiskey",
    iconColor: "green",
    markerColor: "green",
    shape: "circle"
  }),
  ABOVE_AVG: L.ExtraMarkers.icon({
    icon: "fas fa-glass-whiskey",
    iconColor: "greenyellow",
    markerColor: "greenyellow",
    shape: "circle"
  }),
  AVG: L.ExtraMarkers.icon({
    icon: "fas fa-glass-whiskey",
    iconColor: "gold",
    markerColor: "gold",
    shape: "circle"
  }),
  LOW_RATING: L.ExtraMarkers.icon({
    icon: "fas fa-glass-whiskey",
    iconColor: "Red",
    markerColor: "Red",
    shape: "circle"
  })
};

d3.json("../static/distillery.json", function(data) {
  console.log(data);
  
  data.forEach(distillery => {

    var iconKey = "LOW_RATING";

    if (distillery.Rating > 80) {
      iconKey = "HIGHLY_RATED"; 
      console.log(icons[iconKey]);
    }
    else if (distillery.Rating >= 70) {
      iconKey = "ABOVE_AVG";
    }
    else if (distillery.Rating >= 60) {
      iconKey = "AVG";
    }

    var markers = L.marker([distillery.lat, distillery.lon], {
      icon: icons[iconKey]
    });

    markers.addTo(layers[iconKey]);

    markers.bindPopup(distillery.Company + "<br> Country: " + distillery.Country + "<br>" + "<br> Whiskies: " + distillery.Whisky + "<br>" + "<br> Collections: " + distillery.Collection + "<br>" + "<br> Rating: " + distillery.Rating + "<br>");

  });
});
  
var legend = L.control({ position: 'bottomright'});

legend.onAdd = function(){
  var div = L.DomUtil.create("div", "legend");
  return div;
}
legend.addTo(map);

document.querySelector(".legend").innerHTML=displayLegend();

function displayLegend() {
    var legendInfo = [{
        limit: "Highly Rated: 80-90",
        color: "green"
      },{
        limit: "Above Avg: 70-79",
        color: "greenyellow"
      },{
        limit: "Average: 60-69",
        color: "gold"
      },{
        limit: "Low Rated: 0-59",
        color: "red"
      }];

  var header = "<h3>Ratings</h3><hr>";

  var strng = "";

  for (i = 0; i < legendInfo.length; i++) {
    strng += "<p style = \"background-color: " + legendInfo[i].color+"\">"+legendInfo[i].limit+"</p> ";
    }

  return header+strng;
}