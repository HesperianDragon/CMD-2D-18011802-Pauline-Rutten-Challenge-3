
mapboxgl.accessToken = 'pk.eyJ1IjoiaGVzcGVyaWFuZHJhZ29uIiwiYSI6ImNrOTE4YXRwMzA4amkzcnJvMXNyNHdiamwifQ.75IZfiJyy4Ok9UOzHWiaSg';
var map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/streets-v11',
    center: [-79.4512, 43.6568],
    zoom: 13
});

var geocoder = new MapboxGeocoder({
    accessToken: mapboxgl.accessToken,
    mapboxgl: mapboxgl
});

document.getElementById('geocoder').appendChild(geocoder.onAdd(map));

// Add geolocate control to the map.
map.addControl(
    new mapboxgl.GeolocateControl({
        positionOptions: {
            enableHighAccuracy: true
        },
        trackUserLocation: true
    })
);

// SpaceX location
getWeatherForSpaceXLandingZone();
// Location 2
getDutchBeachLandingZone();

function getDutchBeachLandingZone() {
    let longitude = 4.188516
    let latitude = 52.056086
    return fetch(`http://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=c39f0dcbae59b852d83b6045afcbdb9e`)
        .then(data => {
            return data.json();
        })
        .then(weather => {
            let iconUrl = `http://openweathermap.org/img/wn/${weather.weather[0].icon}.png`
            addIconToMap(longitude, latitude, iconUrl)
            const weatherDescription = weather.weather[0].description
            map.flyTo({
                center: [
                    longitude,
                    latitude
                ]
            })
            var safeToLand = false;
            if (weatherDescription === 'clear sky' || weatherDescription === 'few clouds' || weatherDescription === 'scattered clouds') {
                safeToLand = true
            } else {
                safeToLand = false
            }

            var popup = new mapboxgl.Popup().setHTML(`<h3>Dutch beach</h3><p>The weather today is ${weather.weather[0].main.toLowerCase()}</p>
            <br>
            ${safeToLand ? 'It\'s safe to land' : ''}
            `);
            // Adding a marker based on lon lat coordinates
            new mapboxgl.Marker()
                .setLngLat([longitude, latitude])
                .setPopup(popup)
                .addTo(map);
        })
}


// Coordinates from: https://tools.wmflabs.org/geohack/geohack.php?pagename=Landing_Zones_1_and_2&params=28_29_09_N_80_32_40_W_
function getWeatherForSpaceXLandingZone() {
    let longitude = -80.544444
    let latitude = 28.485833
    return fetch(`http://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=c39f0dcbae59b852d83b6045afcbdb9e`)
        .then(data => {
            return data.json();
        })
        .then(spaceXLandingZoneWeather => {
            let iconUrl = `http://openweathermap.org/img/wn/${spaceXLandingZoneWeather.weather[0].icon}.png`
            addIconToMap(longitude, latitude, iconUrl)
            const weatherDescription = spaceXLandingZoneWeather.weather[0].description
            var safeToLand = false;
            if (weatherDescription === 'clear sky' || weatherDescription === 'few clouds' || weatherDescription === 'scattered clouds') {
                safeToLand = true
            } else {
                safeToLand = false
            }

            var popup = new mapboxgl.Popup().setHTML(`<h3>SpaceX</h3><p>The weather today is ${spaceXLandingZoneWeather.weather[0].main.toLowerCase()}</p>
            <br>
            ${safeToLand ? 'It\'s safe to land' : ''}
            `);
            console.log(spaceXLandingZoneWeather)
            // Adding a marker based on lon lat coordinates
            new mapboxgl.Marker()
                .setLngLat([longitude, latitude])
                .setPopup(popup)
                .addTo(map);
        })
}

function addIconToMap(longitude, latitude, imageUrl) {
    var random = parseInt(Math.random() * 999999)
    map.loadImage(
        imageUrl,
        function (error, image) {
            if (error) throw error;
            map.addImage('weatherImage' + random, image);
            map.addSource('point' + random, {
                'type': 'geojson',
                'data': {
                    'type': 'FeatureCollection',
                    'features': [
                        {
                            'type': 'Feature',
                            'geometry': {
                                'type': 'Point',
                                'coordinates': [longitude, latitude]
                            }
                        }
                    ]
                }
            });
            map.addLayer({
                'id': 'points' + random,
                'type': 'symbol',
                'source': 'point' + random,
                'layout': {
                    'icon-image': 'weatherImage' + random,
                    'icon-size': 2
                }
            });
        }
    );
}


