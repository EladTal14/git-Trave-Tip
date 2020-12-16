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
    onCopyLocation();
    // Promise.all([getUserPosition(), initMap()])

    const coords = checkForLatLngParams();
    console.log(coords);
    if (!coords) {
        panTo(+coords.lat, +coords.lng)
        addMarker(+coords.lat, +coords.lng)
    }
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
                    panTo(res.coords.lat, res.coords.lng)
                    addMarker(res.coords)
                    renderTable()
                    renderLocationName(res.addressName)
                    document.querySelector('input').value = '';
                })
                .catch(() => {
                    document.querySelector('input').value = 'Address couldn`t be found';
                    setTimeout(() => {
                        document.querySelector('input').value = '';
                    }, 1500);
                })
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
                            <td><button class="go-to-btn" data-id="${location.id}" data-lng="${location.lng}" data-lat="${location.lat}"">GO</button></td>
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
                    locationService.updateTimeById(elGoBtn.dataset.id)
                    renderTable()
                    panTo(+elGoBtn.dataset.lat, +elGoBtn.dataset.lng)
                    addMarker({
                        lat: +elGoBtn.dataset.lat,
                        lng: +elGoBtn.dataset.lng
                    })
                })
            })
        })
}

function renderLocationName(addressName) {
    document.querySelector('.chosen-place').innerText = addressName;
}

function onCopyLocation() {
    document.querySelector('.copy-address').addEventListener('click', ev => {
        console.log('clicky ckicky clock');
        const addressName = document.querySelector('.chosen-place').innerText;
        let addressLatLng = locationService.getLatLngByName(addressName);
        console.log(addressLatLng.lat, addressLatLng.lng);
        saveAddressForUser(addressLatLng.lat, addressLatLng.lng)
        alert('Copied successfuly!');
    })
}

function saveAddressForUser(lat, lng) {
    let linkToCopy = `https://eladtal14.github.io/git-Trave-Tip/index.html?lat=${lat}&lng=${lng}`;
    var tempInput = document.createElement("input");
    tempInput.value = linkToCopy;
    document.body.appendChild(tempInput);
    tempInput.select();
    document.execCommand("copy");
    document.body.removeChild(tempInput);
}

function getParameterByName(name, url = window.location.href) {
    name = name.replace(/[\[\]]/g, '\\$&');
    var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, ' '));
}

function checkForLatLngParams() {
    const lat = getParameterByName('lat');
    const lng = getParameterByName('lng');
    if (!lat && !lng) return false;
    return {
        lat,
        lng
    };
}