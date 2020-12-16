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
        .then(() => {
            // locationService.createLocations()
            renderTable()
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
    onGetUserToGo();
    // Promise.all([getUserPosition(), initMap()])


}


export function initMap(lat = 32.0749831, lng = 34.9120554) {

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
            console.log('Map!', gGoogleMap);
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
    const API_KEY = 'AIzaSyBvWXXK1AOaM6MXDXEfNfdo1XbAZ5FMrjI'; // Key Elad
    var elGoogleApi = document.createElement('script');
    elGoogleApi.src = `https://maps.googleapis.com/maps/api/js?key=${API_KEY}`;
    elGoogleApi.async = true;
    document.body.append(elGoogleApi);

    return new Promise((resolve, reject) => {
        elGoogleApi.onload = resolve;
        elGoogleApi.onerror = () => reject('Google script failed to load')
    })
}


function onGetUserToGo() {
    document.querySelector('.btn-go-to')
        .addEventListener('click', ev => {
            let address = document.querySelector('input').value;
            if (!address) return;
            locationService.getUserAddress(address)
                .then(res => {
                    panTo(res.lat, res.lng)
                    addMarker(res)
                    renderTable()
                    document.querySelector('input').value = '';
                });
        });
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
                            <td><button class="delete-btn" data-id="${location.id}">DELETE</button></td>
                        </tr>`
            })

            document.querySelector('tbody').innerHTML = strHtmls.join('')
        })
        .then(() => {
            const elDeleteBtns = document.querySelectorAll('.delete-btn')
            elDeleteBtns.forEach(elDeleteBtn => {
                elDeleteBtn.addEventListener('click', function () {
                    locationService.removeLocation(elDeleteBtn.dataset.id)
                    renderTable()
                })
            })

            const elGoBtns = document.querySelectorAll('.go-to-btn')
            elGoBtns.forEach(elGoBtn => {
                elGoBtn.addEventListener('click', function () {
                    panTo(+elGoBtn.dataset.lat, +elGoBtn.dataset.lng)
                    addMarker({
                        lat: +elGoBtn.dataset.lat,
                        lng: +elGoBtn.dataset.lng
                    })
                })
            })
        })
}