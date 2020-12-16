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
    createdAt: Date.now(),
    updatedAt: Date.now()
}];

function getLocations() {
    return Promise.resolve(gLocations)
}