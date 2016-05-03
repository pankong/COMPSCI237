"use strict";


/*
   _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _
  |                   |               |
  |                   |               |
  |     Santa Ana     |    Tustin     |
  |        (1)        |     (2)       |
  |                   |               |
  | _ _ _ _ _ _ _ _ _ | _ _ _ _ _ _ _ |
  |       |                           |
  |       |                           |
  | Costa |          Irvine           |
  | Mesa  |           (4)             |
  | (3)   |                           |
  | _ _ _ | _ _ _ _ _ _ _ _ _ _ _ _ _ |

  North bound: 33.766973
  South bound: 33.612013
  East bound: -117.756755
  West bound: -117.938547
  Santa Ana | Tustin: -117.839670
  Costa Mesa | Irvine: -117.896661
  Tusin | Irvine: 33.688811
*/

const northBound = 33.766973;
const southBound = 33.612013;
const eastBound = -117.756755;
const westBound = -117.938547;
const SantaTustinBound = -117.839670;
const CostaIrvineBound = -117.896661;
const TustinIrvineBound = 33.688811;

// takes position and determins which district the user is belonged to
function getDistrict(latitude, longitude) {
  var district = -1;
  if (latitude > TustinIrvineBound) {
    if (longitude < SantaTustinBound) {
      district = 1;
    } else {
      district = 2;
    }
  } else {
    if (longitude < CostaIrvineBound) {
      district = 3;
    } else {
      district = 4;
    }
  }
  return district;
};

// retrieve rider's current location and post to the server
function getLocation() {
  if (navigator.geolocation) {
    console.log('location found');
    navigator.geolocation.getCurrentPosition(postRiderPosition);
  } else {
    console.log("Geolocation is not supported by this browser.");
  }
};

// post rider's location to server
function postRiderPosition(position) {
  var district = getDistrict(position.coords.latitude, position.coords.longitude);
  console.log("Latitude: " + position.coords.latitude);
  console.log("Longitude: " + position.coords.longitude);
  console.log("District: " + district);
  $.post("/ride",{
    "latitude": position.coords.latitude,
    "longitude": position.coords.longitude,
    "district": district
  },function(message, status){
        alert(message + "Status: " + status);
    });
};

var updateIntervalId;
var updateCount;

//retrieve driver's current location and post to the server periodically
function updateLocation() {
  if (navigator.geolocation) {
    console.log('location found');
    // update location every 5 seconds
    var interval = 5000;
    updateIntervalId = setInterval(setTime, interval);
    updateCount = 0;
    var updateInfo = document.getElementById("updateInfo");
    function setTime() {
      ++updateCount;
      console.log(updateCount + "th update");
      navigator.geolocation.getCurrentPosition(postDriverPosition);
      updateInfo.innerHTML = updateCount;
      };
    } else {
    console.log("Geolocation is not supported by this browser.");
  }
};

function stopUpdate() {
  updateCount = 0;
  clearInterval(updateIntervalId);
}

// post driver's location to server
function postDriverPosition(position) {
  var district = getDistrict(position.coords.latitude, position.coords.longitude);
  console.log("   Latitude: " + position.coords.latitude);
  console.log("   Longitude: " + position.coords.longitude);
  console.log("   District: " + district);
  $.post("/drive",{
    "latitude": position.coords.latitude,
    "longitude": position.coords.longitude,
    "district": district
  });
};

var simulateIntervalId;
var simulateCount;

//simulate driver driving and post location updates to the server periodically
function simulateDriving() {
  // start driving from UC Irvine
  var latitude = 33.64091921;
  var longitude = -117.84210205;
  // update location every 5 seconds
  var interval = 5000;
  simulateIntervalId = setInterval(setTime, interval);
  simulateCount = 0;
  var updateInfo = document.getElementById("updateInfo");
  function setTime() {
    ++simulateCount;
    var moveLat = Math.random() * 0.01;
    var moveLon = Math.random() * 0.01;
    if (moveLat < 0.005) {
      latitude += moveLat;
    } else {
      latitude -= moveLat;
    }
    if (moveLon < 0.005) {
      longitude += moveLon;
    } else {
      longitude -= moveLon;
    }
    // check if the driver goes beyond the bound
    if (longitude > eastBound) {
      longitude = eastBound;
    }
    else if (longitude < westBound) {
      longitude = westBound;
    }
    if (latitude > northBound) {
      latitude = northBound;
    }
    else if  (latitude < southBound) {
      latitude = southBound;
    }
    var district = getDistrict(latitude, longitude);
    console.log(simulateCount + "th update");
    console.log("   Latitude: " + latitude);
    console.log("   Longitude: " + longitude);
    console.log("   District: " + district);
    $.post("/drive",{
      "latitude": latitude,
      "longitude": longitude,
      "district": district
    });
    updateInfo.innerHTML = simulateCount;
  };
}

function stopSimulate() {
  simulateCount = 0;
  clearInterval(simulateIntervalId);
}
