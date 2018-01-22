var watchId = 0;

$(document).ready(function () {
    getLocation();
    $('#startMonitoring').on('click', getLocation);
    $('#stopMonitoring').on('click', endWatch);
});

/*
function getLocation() {
    if (supportsGeoLocation()) {
        navigator.geolocation.getCurrentPosition(showPosition, showError);
    } else {
        showMessage("Getlocation is not supported by this browser");
    }
}
*/

// continous monitoring position
// callback when position is updated
function getLocation() {
    if (supportsGeoLocation()) {
        var options = {
            enableHighAccuracy: true
        };
        watchId = navigator.geolocation.watchPosition(showPosition, showError, options);
    }
    else {
        showMessage("Geolocation is not supported by this browser.");
    }
}

function getDistance(lat1, lon1, lat2, lon2) {    
    var earthRadius = 3959; //miles
    var latRadians = getRadians(lat2 - lat1);
    var lonRadians = getRadians(lon2 - lon1);
    
    var a = Math.sin(latRadians / 2) * Math.sin(latRadians / 2) +
            Math.cos(getRadians(lat1)) * Math.cos(getRadians(lat2)) *
            Math.sin(lonRadians / 2) * Math.sin(lonRadians / 2);
    
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    var distance = earthRadius * c;

    return distance;
}

function endWatch() {
    if (watchId != 0) {
        navigator.geolocation.clearWatch(watchId);
        watchId = 0;
        showMessage("Monitoring ended");
    }
}

function supportsGeoLocation() {
    return 'geolocation' in navigator;
}

function showMessage(message) {
    $('#message').html(message);
}

function showPosition(position) {
    var datetime = new Date(position.timestamp).toLocaleString();
    showMessage("Latitude: " + position.coords.latitude + "<br />"
               + "Longitude: " + position.coords.longitude + "<br />"
               + "Timestamp: " + datetime);
}

function showError(error) {
    switch(error.code) {
        case error.PERMISSION_DENIED:
            showMessage("User denied Geolocation access request");
            break;
        case error.POSITION_UNAVAILABLE:
            showMessage("Location information unavailable");
            break;
        case error.TIMEOUT:
            showMessage("Get user location request timeout");
            break;
        case error.UNKNOWN_ERROR:
            showMessage("An unknown error occured");
            break;
        
    }
}
    
    