export const utilService = {
  saveToStorage,
  loadFromStorage,
  getId
}


function saveToStorage(key, val) {
  localStorage.setItem(key, JSON.stringify(val))
}

function loadFromStorage(key) {
  const json = localStorage.getItem(key)
  return JSON.parse(json)
}


function getId() {
  return Math.random().toString(36).substr(2, 9)
}