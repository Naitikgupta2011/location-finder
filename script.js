function requestLocation() {
  if (!navigator.geolocation) {
    alert("GPS is not supported.");
    return;
  }

  navigator.geolocation.getCurrentPosition(
    function(position) {
      alert(
        "Location received!\nLatitude: " +
        position.coords.latitude +
        "\nLongitude: " +
        position.coords.longitude
      );
    },
    function(error) {
      alert("Location error: " + error.message);
    },
    {
      enableHighAccuracy: true,
      timeout: 30000,
      maximumAge: 0
    }
  );
}

function showRequests() {
  alert("Location requests coming soon!");
}

function showSMS() {
  alert("SMS assistance coming soon!");
}
