$(document).ready(function () {
    getLocation();
});

function getLocation() {
    if (supportsGeoLocation()) {
        navigator.geolocation.getCurrentPosition(showPosition);
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
    
    