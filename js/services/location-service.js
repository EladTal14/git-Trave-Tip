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
    createdAt: Date.now(),
    updatedAt: Date.now()
}];

function getLocations() {
    return Promise.resolve(gLocations)
}

function getData(url) {
    return axios.get(url)
        .then(res => res)
}

function getUserAddress(address) {
    let currUrl = `https://maps.googleapis.com/maps/api/geocode/json?address=${address}&key=AIzaSyDxSbj3Jc5DGF8JSU6w2D2_qqiLb2i1gCE`;
    getData(currUrl).then(res => {
        console.log(res);
        return res;
    }) 
}



