let myMap = L.map("map", {
    center: [40.7608, -111.8910],
    zoom: 5.5
});

// Adding the tile layer
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(myMap);

//Defining Function for color scale as per depth
function getColor(depth) {
    return depth > 90 ? "Red" :
        depth > 70 ? "#FF6347" :
            depth > 50 ? "#FFA500" :
                depth > 30 ? "#FFD700" :
                    depth > 10 ? "#addd8e" :
                        "#31a354";
}
//Defining function for size of circles as per magnitude
function markerSize(magnitude) {
    return magnitude * 10000
}

// Getting Data using D3.
d3.json('https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson').then((data) => {
    console.log(data)

    //Storing Earthquake data in features variable.
    let features = data.features

    // Using for loop to reiterate through data set and get coordinates. 
    for (let i = 0; i < features.length; i++) {

        let coords = features[i].geometry.coordinates
        let mag = features[i].properties.mag
        let time = new Date(features[i].properties.time).toLocaleString()
        let timeUpdated = new Date(features[i].properties.updated).toLocaleString()
        let markers = L.circle([coords[1], coords[0]], {
            color: 'black',
            fillColor: getColor(coords[2]),
            fillOpacity: 0.75,
            radius: markerSize(mag),
            weight: 0.5
        }).addTo(myMap);

        markers.bindPopup("<strong>" + features[i].properties.place +
            "</strong><br /><br />Earthquake of Magnitude (ML):  " +
            features[i].properties.mag + "<br /><br />Time of Earthquake : "
            + time + "<br /><br /> Last Update :" + timeUpdated)
    }
    // Creating legend 
    let legend = L.control({ position: 'bottomright' })
    legend.onAdd = function () {
        var div = L.DomUtil.create('div', 'info legend')
        var limits = [0, 10, 30, 50, 70, 90]
        var colors = ["#31a354", "#addd8e", "#FFD700", "#FFA500", "#FF6347", "Red"]

        for (var i = 0; i < limits.length; i++) {
            div.innerHTML +=
                '<i style="background:' + colors[i] + '"></i> ' +
                limits[i] + (limits[i + 1] ? '&ndash;' + limits[i + 1] + '<br>' : '+');
        }

        return div;
    };

    legend.addTo(myMap)
})
