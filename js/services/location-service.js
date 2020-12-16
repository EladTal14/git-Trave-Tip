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
const gLocations = createLocations()

function createLocations() {
    var locations = utilService.loadFromStorage(KEY)
    console.log(locations);
    if (!locations || locations.length === 0) {
        locations = []
        locations.push({
            id: utilService.getId(),
            name: 'puki house',
            lat: 18,
            lng: 18,
            createdAt: utilService.showTime(),
            updatedAt: utilService.showTime()
        })
    }
    utilService.saveToStorage(KEY, locations)
    return locations
}

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
    utilService.saveToStorage(KEY, gLocations)
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
        createLocation(address, lat, lng)
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