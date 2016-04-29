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
  console.log("Latitude: " + position.coords.latitude);
  console.log("Longitude: " + position.coords.longitude);
  $.post("/ride",{
    "latitude": position.coords.latitude,
    "longitude": position.coords.longitude
  },function(message, status){
        alert(message + "Status: " + status);
    });
};

//retrieve driver's current location and post to the server periodically
function updateLocation() {
  if (navigator.geolocation) {
    console.log('location found');
    // update location every 5 seconds
    var interval = 5000;
    setInterval(setTime, interval);
    var updateCount = 0;
    var updateInfo = document.getElementById("updateInfo");
    function setTime()
    {
        ++updateCount;
        navigator.geolocation.getCurrentPosition(postDriverPosition);
        updateInfo.innerHTML = updateCount;
        console.log(updateCount);
    }
  } else {
    console.log("Geolocation is not supported by this browser.");
  }
};

// post driver's location to server
function postDriverPosition(position) {
  console.log("Latitude: " + position.coords.latitude);
  console.log("Longitude: " + position.coords.longitude);
  $.post("/drive",{
    "latitude": position.coords.latitude,
    "longitude": position.coords.longitude
  });
};
