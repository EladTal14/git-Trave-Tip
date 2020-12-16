import {
    utilService
} from './util-service.js'

export const locationService = {
    getLocations
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