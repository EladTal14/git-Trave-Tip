import {
    utilService
} from './util-service.js'

export const locationService = {
    getLocations,
    getData,
    getUserAddress,
    removeLocation,
    getLatLngByName,
    updateTimeById
}
const KEY = 'locationsDB'
const gLocations = createLocations()
const WEATHER_KEY = 'a225ed02308417d68f1811581aa93103'

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

function createLocation(name, lat, lng, userAddress) {
    const location = {
        id: utilService.getId(),
        name,
        lat,
        lng,
        userAddress,
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
    const addressUser = getNameByUserAddress(address)
    if (addressUser) {
        addressUser.updatedAt = utilService.showTime()
        return Promise.resolve({
            coords: {
                lat: addressUser.lat,
                lng: addressUser.lng
            },
            addressName: addressUser.name

        })
    }

    let currUrl = `https://maps.googleapis.com/maps/api/geocode/json?address=${address}&key=AIzaSyBvWXXK1AOaM6MXDXEfNfdo1XbAZ5FMrjI`;
    return getData(currUrl)

        .then(res => {
            const addressName = res.results[0].formatted_address;
            const lat = res.results[0].geometry.location.lat;
            const lng = res.results[0].geometry.location.lng;
            createLocation(addressName, lat, lng, address)
            return {
                coords: {
                    lat,
                    lng
                },
                addressName
            };
        })
        .catch(err => console.log(err));

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


function getLatLngByName(addressName) {
    return gLocations.find(location => {
        if (location.name === addressName) return location;
    })
}

function getNameByUserAddress(addressName) {
    return gLocations.find(location => {
        if (location.userAddress === addressName) return location;
    })
}

function updateTimeById(locationId) {
    let counter = -1
    gLocations.find(location => {
        counter++
        return locationId === location.id
    })
    gLocations[counter].updatedAt = utilService.showTime()

}