$(document).ready(function() {
  showMap();
});

// Display map
function showMap() {
  var lat = 43.6425662;
  var long = -79.3892455;
  var uluru = {lat: 43.6425662, lng: -79.3892455};

  var myOptions = {
    zoom: 16,
    center: new google.maps.LatLng(lat, long),
    mapTypeId: google.maps.MapTypeId.ROADMAP
  }
  var map = new google.maps.Map(document.getElementById('map-canvas'), myOptions);
  var marker = new google.maps.Marker({
          position: uluru,
          map: map
        });
  document.getElementById('map-canvas').style.display = "block";
};
