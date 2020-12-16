import {
    utilService
} from './util-service.js'

export const locationService = {
    getLocations,
    getData,
    getUserAddress,
    removeLocation,
}
const KEY = 'locationsDB'
const gLocations = [{
    id: utilService.getId(),
    name: 'Puki Home',
    lat: 1,
    lng: 1,
    createdAt: utilService.showTime(),
    updatedAt: utilService.showTime()
}, {
    id: utilService.getId(),
    name: 'elad Home',
    lat: 2,
    lng: 2,
    createdAt: utilService.showTime(),
    updatedAt: utilService.showTime()
}];

function createLocation(name, lat, lng) {
    const location = {
        id: utilService.getId(),
        name,
        lat,
        lng,
        createdAt: utilService.showTime(),
        updatedAt: utilService.showTime()
    }
    gLocations.push(location)
    saveToStorage
}

function getLocations() {
    return Promise.resolve(gLocations)
}

function getData(url) {
    return axios.get(url)
        .then(res => res.data)
}

function getUserAddress(address) {
    let currUrl = `https://maps.googleapis.com/maps/api/geocode/json?address=${address}&key=AIzaSyBvWXXK1AOaM6MXDXEfNfdo1XbAZ5FMrjI`;
    return getData(currUrl).then(res => {
        console.log(res.results[0].formatted_address);
        const lat = res.results[0].geometry.location.lat;
        const lng = res.results[0].geometry.location.lng;
        return {
            lat,
            lng
        };
    });
}

function removeLocation(locationToDelId) {
    let counter = -1
    gLocations.find(location => {
        counter++
        return locationToDelId === location.id
    })
    gLocations.splice(counter, 1)
    utilService.saveToStorage(KEY, gLocations)

}