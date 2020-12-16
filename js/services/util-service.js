export const utilService = {
  saveToStorage,
  loadFromStorage,
  getId,
  showTime
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

function showTime() {
  var timeNow = new Date();
  var hours = timeNow.getHours();
  var minutes = timeNow.getMinutes();
  var seconds = timeNow.getSeconds();
  var timeString = "" + ((hours > 12) ? hours - 12 : hours);
  timeString += ((minutes < 10) ? ":0" : ":") + minutes;
  timeString += ((seconds < 10) ? ":0" : ":") + seconds;
  console.log(timeString);
  return timeString
}