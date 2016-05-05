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

// parameters for spinner
var opts = {
  lines: 13 // The number of lines to draw
  , length: 28 // The length of each line
  , width: 14 // The line thickness
  , radius: 42 // The radius of the inner circle
  , scale: 1 // Scales overall size of the spinner
  , corners: 1 // Corner roundness (0..1)
  , color: '#000' // #rgb or #rrggbb or array of colors
  , opacity: 0.25 // Opacity of the lines
  , rotate: 0 // The rotation offset
  , direction: 1 // 1: clockwise, -1: counterclockwise
  , speed: 1 // Rounds per second
  , trail: 60 // Afterglow percentage
  , fps: 20 // Frames per second when using setTimeout() as a fallback for CSS
  , zIndex: 2e9 // The z-index (defaults to 2000000000)
  , className: 'spinner' // The CSS class to assign to the spinner
  , top: '50%' // Top position relative to parent
  , left: '50%' // Left position relative to parent
  , shadow: false // Whether to render a shadow
  , hwaccel: false // Whether to use hardware acceleration
  , position: 'absolute' // Element positioning
};
var spinner = new Spinner(opts).spin();

// retrieve rider's current location and post to the server
function requestRide() {
  if (navigator.geolocation) {
    console.log('location found');
    navigator.geolocation.getCurrentPosition(postRiderPosition);
    spinner.spin();
    $('#loading').append(spinner.el);
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
  },function(message, status) {
    spinner.stop();
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

// control parts for the buttons
$(document).ready(function(){
  $("#updateLocation").click(function(){
    document.getElementById("updateInfo").innerHTML = 0;
    spinner.spin();
    $('#loading').append(spinner.el);
    updateLocation();
  });
  $("#stopUpdate").click(function(){
    spinner.stop();
    stopUpdate();
  });
  $("#simulateDrive").click(function(){
    document.getElementById("updateInfo").innerHTML = 0;
    spinner.spin();
    $('#loading').append(spinner.el);
    simulateDriving();
  });
  $("#stopSimulate").click(function(){
    spinner.stop();
    stopSimulate();
  });
});
