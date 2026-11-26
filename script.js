let map = null;
let marker = null;
let accuracyCircle = null;
let watchId = null;
let firstLocation = true;
let followEnabled = true;

function initializeMap() {
  if (map) return;

  map = L.map("map").setView([20.5937, 78.9629], 5);

  L.tileLayer(
    "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
    {
      maxZoom: 19,
      attribution: "&copy; OpenStreetMap contributors"
    }
  ).addTo(map);
}

function toggleFollow() {
  followEnabled = !followEnabled;

  const button = document.querySelector(".follow");

  button.textContent = followEnabled
    ? "🧭 Follow Me: ON"
    : "🧭 Follow Me: OFF";

  if (followEnabled && marker) {
    map.panTo(marker.getLatLng());
  }
}

function requestLocation() {
  if (!navigator.geolocation) {
    alert("GPS is not supported.");
    return;
  }

  if (watchId !== null) return;

  initializeMap();
  firstLocation = true;

  document.getElementById("status").textContent =
    "Getting location...";

  watchId = navigator.geolocation.watchPosition(
    function(position) {
      const lat = position.coords.latitude;
      const lng = position.coords.longitude;
      const accuracy = position.coords.accuracy;

      const location = [lat, lng];

      document.getElementById("latitude").textContent =
        "Latitude: " + lat.toFixed(6);

      document.getElementById("longitude").textContent =
        "Longitude: " + lng.toFixed(6);

      document.getElementById("accuracy").textContent =
        "Accuracy: " + Math.round(accuracy) + " meters";

      document.getElementById("status").textContent =
        "● Live location active";

      if (!marker) {
        marker = L.marker(location)
          .addTo(map)
          .bindPopup("Your current location");
      } else {
        marker.setLatLng(location);
      }

      if (!accuracyCircle) {
        accuracyCircle = L.circle(location, {
          radius: accuracy,
          color: "#2389ff",
          fillOpacity: 0.15
        }).addTo(map);
      } else {
        accuracyCircle.setLatLng(location);
        accuracyCircle.setRadius(accuracy);
      }

      if (firstLocation) {
        map.setView(location, 16);
        marker.openPopup();
        firstLocation = false;
      } else if (followEnabled) {
        map.panTo(location, {
          animate: true
        });
      }
    },

    function(error) {
      const messages = {
        1: "Location permission denied.",
        2: "Location unavailable.",
        3: "Location request timed out."
      };

      document.getElementById("status").textContent =
        "Location error";

      alert(messages[error.code] || error.message);

      if (watchId !== null) {
        navigator.geolocation.clearWatch(watchId);
        watchId = null;
      }
    },

    {
      enableHighAccuracy: true,
      timeout: 30000,
      maximumAge: 3000
    }
  );
}

function stopLocation() {
  if (watchId !== null) {
    navigator.geolocation.clearWatch(watchId);
    watchId = null;
  }

  document.getElementById("status").textContent =
    "Location stopped";
      }
          
