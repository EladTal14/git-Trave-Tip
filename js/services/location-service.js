import {
    utilService
} from './util-service.js'

export const locationService = {
    getLocations,
    getData,
    getUserAddress
}

const gLocations = [{
    id: utilService.getId(),
    name: 'Puki Home',
    lat: 17,
    lng: 19,
    createdAt: utilService.showTime(),
    updatedAt: utilService.showTime()
}, {
    id: utilService.getId(),
    name: 'elad Home',
    lat: 18,
    lng: 20,
    createdAt: utilService.showTime(),
    updatedAt: utilService.showTime()
}];

function getLocations() {
    return Promise.resolve(gLocations)
}

function getData(url) {
    return axios.get(url)
        .then(res => res)
}

function getUserAddress(address) {
    let currUrl = `https://maps.googleapis.com/maps/api/geocode/json?address=${address}&key=AIzaSyBvWXXK1AOaM6MXDXEfNfdo1XbAZ5FMrjI`;
    getData(currUrl).then(res => {
        console.log(res);
        return res;
    }) 
}



