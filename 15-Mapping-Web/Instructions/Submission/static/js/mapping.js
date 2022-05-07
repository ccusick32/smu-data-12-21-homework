$(document).ready(function() {
    doWork();
});

function doWork() {
    var url = `https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojson`;
    var plate_url = 'static/data/PB2002_boundaries.json';
    requestAjax(url,plate_url);
}

function requestAjax(url,plate_url) {
    $.ajax({
        type: "GET",
        url: url,
        contentType: "application/json; charset=utf-8",
        success: function(data) {
            //Nested Ajax function
            $.ajax({
                type: "GET",
                url: plate_url,
                contentType: "application/json",
                dataType: "json",
                success: function(plate_data) {
                    console.log(data);
                    console.log(plate_data);
                    createMap(data, plate_data);

                },
                error: function(data) {
                    console.log("Error retrieving data");
                },
                complete: function(data) {
                    console.log("Request finished");
                }
            });
        },
        error: function(textStatus, errorThrown) {
            console.log("Failed to get data");
            console.log(textStatus);
            console.log(errorThrown);
        }
    });
}

function onEachFeature(feature, layer) {
    if (feature.properties) {
        layer.bindPopup(`<h3>${ feature.properties.title } at depth: ${feature.geometry.coordinates[2].toFixed(0)}m</h3><hr><p>${new Date(feature.properties.time)}</p >`);

    }
}

//createMap function will take the earthquake data and incorporate into the visualisation
function createMap(data, plate_data) {
    //applying filter
    var earthquakes = data.features

    //Base Map layers
    var dark_layer = L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
        attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
        id: 'mapbox/dark-v10',
        accessToken: API_KEY
    });

    var light_layer = L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
        attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
        id: 'mapbox/light-v10',
        accessToken: API_KEY
    });

    var street_layer = L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
        attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
        id: 'mapbox/streets-v11',
        accessToken: API_KEY
    });

    //create overlay object
    var earthquakeLayer = L.geoJSON(earthquakes, {
        onEachFeature: onEachFeature
    });

    //Tectonic plate layer
    var plateLayer = L.geoJSON(plate_data.features, {
        style: {
            "color": "orange",
            "weight": 1,
            opacity: .75
        }
    });

    var circles = [];
    for (let i = 0; i < earthquakes.length; i++) {
        let earthquake = earthquakes[i];
        let circle_color = "green";

        let location = [earthquake.geometry.coordinates[1], earthquake.geometry.coordinates[0]]

        let circle = L.circle(location, {
            color: getColor(earthquake.geometry.coordinates[2]),
            fillColor: getColor(earthquake.geometry.coordinates[2]),
            fillOpacity: 0.75,
            radius: getRadius(earthquake.properties.mag)
        }).bindPopup(`<h3>${ earthquake.properties.title } at depth: ${earthquake.geometry.coordinates[2].toFixed(0)}m</h3><hr><p>${new Date(earthquake.properties.time)}</p >`);
        circles.push(circle);
    }

    var circleLayer = L.layerGroup(circles);

    //creating basemaps object
    var baseMaps = {
        "Dark": dark_layer,
        "Light": street_layer,
        "Street": street_layer
    };

    //Toggleable overlays
    var overlayMaps = {
        Markers: earthquakeLayer,
        Circles: circleLayer,
        Plates: plateLayer
    };

    //Create new map
    var myMap = L.map("map", {
        center: [
            37.098, -95.71
        ],
        zoom: 5,
        layers: [dark_layer, circleLayer, plateLayer]
    });

    //Create layer control that has baseMaps
    L.control.layers(baseMaps, overlayMaps).addTo(myMap);

    //add legend
    //https://gis.stackexchange.com/questions/133630/adding-leaflet-legend
    var legend = L.control({
        position: "bottomright"
    });

    legend.onAdd = function() {
        var div = L.DomUtil.create('div', 'info legend');
        var labels = ["<10", "10-30", "30-70", "70+"];
        var colors = ["green", "yellow", "orange", "red"];

        for (let i = 0; i < labels.length; i++) {
            let label = labels[i];
            let color = colors[i]

            let html = `<i style='background:${color}'></i>${label}<br>`;
            div.innerHTML += html;
        }
        return div;
    }

    legend.addTo(myMap);
}

function getRadius(mag) {
    return mag * 10000
}

function getColor(depth){
    let color = 'red';

    if (depth>=70){
        color = 'red';
    } else if (depth>=30) {
        color = 'orange';
    } else if (depth>=10) {
        color = 'yellow';
    } else {
        color = 'green';
    }

    return (color);
}