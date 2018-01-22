$(document).ready(function () {
    getLocation();
});

function getLocation() {
    if (supportsGeoLocation()) {
        navigator.geolocation.getCurrentPosition(showPosition, showError);
    } else {
        showMessage("Getlocation is not supported by this browser");
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
    
    