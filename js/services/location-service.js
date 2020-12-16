import {
    utilService
} from './util-service.js'

export const locationService = {
    getLocations
}

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

function getLocations() {
    return Promise.resolve(gLocations)
}