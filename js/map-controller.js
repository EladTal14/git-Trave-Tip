import {
    locationService
} from './services/location-service.js'


// console.log('locationService', locationService);

var gGoogleMap;

window.onload = () => {
    initMap()
        .then(() => {
            addMarker({
                lat: 32.0749831,
                lng: 34.9120554
            });
        })
        .catch(console.log('INIT MAP ERROR'));

    getUserPosition()
        .then(pos => {
            // console.log('User position is:', pos.coords);
            document.querySelector('.btn-my-location').addEventListener('click', (ev) => {
                panTo(pos.coords.latitude, pos.coords.longitude)
                addMarker({
                    lat: pos.coords.latitude,
                    lng: pos.coords.longitude
                })
            })
        })
        .catch(err => {
            console.log('err!!!', err);
        })
    document.querySelector('.btn').addEventListener('click', (ev) => {
        // console.log('Aha!', ev.target);
        panTo(35.6895, 139.6917);
    })
    Promise.all([getUserPosition(), initMap()])
        .then(() => renderTable())

}


export function initMap(lat = 32.0749831, lng = 34.9120554) {
    console.log('InitMap');
    return _connectGoogleApi()
        .then(() => {
            // console.log('google available');
            gGoogleMap = new google.maps.Map(
                document.querySelector('#map'), {
                    center: {
                        lat,
                        lng
                    },
                    zoom: 15
                })
            // console.log('Map!', gGoogleMap);
        })
}

function addMarker(loc) {
    var marker = new google.maps.Marker({
        position: loc,
        map: gGoogleMap,
        title: 'Hello World!'
    });
    return marker;
}

function panTo(lat, lng) {
    var laLatLng = new google.maps.LatLng(lat, lng);
    gGoogleMap.panTo(laLatLng);
}

function getUserPosition() {
    // console.log('Getting Pos');
    return new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject)
    })
}


function _connectGoogleApi() {
    if (window.google) return Promise.resolve()
    const API_KEY = 'AIzaSyBvWXXK1AOaM6MXDXEfNfdo1XbAZ5FMrjI'; //TODO: Enter your API Key
    var elGoogleApi = document.createElement('script');
    elGoogleApi.src = `https://maps.googleapis.com/maps/api/js?key=${API_KEY}`;
    elGoogleApi.async = true;
    document.body.append(elGoogleApi);

    return new Promise((resolve, reject) => {
        elGoogleApi.onload = resolve;
        elGoogleApi.onerror = () => reject('Google script failed to load')
    })
}

function renderTable() {
    locationService.getLocations()
        .then(locations => {
            const strHtmls = locations.map(location => {

                return `<tr>
                            <td>${location.name}</td>
                            <td>${location.createdAt}</td>
                            <td>${location.updatedAt}</td>
                            <td><button class="go-to-btn" data-lng="${location.lng}" data-lat="${location.lat}"">GO</button></td>
                            <td><button>DELETE</button></td>
                        </tr>`
            })
            const elBtns = document.querySelectorAll('.go-to-btn')
            elBtns.forEach(elBtn => {
                elBtn.addEventListener('click', goToLocation)
            })
            document.querySelector('tbody').innerHTML = strHtmls.join('')
        })
}

function goToLocation(lat, lng) {
    panTo(+lat, +lng)
}