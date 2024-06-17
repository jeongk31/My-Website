var container = document.getElementById('map');
var options = {
    center: new kakao.maps.LatLng(37.5665, 126.9780),
    level: 7
};
var map = new kakao.maps.Map(container, options);

fetch('locations.json')
    .then(response => response.json())
    .then(tourismSpots => {
        function addMarkers(spots) {
            map.markers = map.markers || [];
            map.markers.forEach(marker => marker.setMap(null));
            map.markers = [];

            spots.forEach(spot => {
                var marker = new kakao.maps.Marker({
                    map: map,
                    position: new kakao.maps.LatLng(spot.lat, spot.lng),
                    title: spot.name
                });

                var infowindowContent = `
                    <div style="padding:10px; font-size: 14px; max-width: 250px; white-space: pre-line;">
                        <img src="${spot.image}" alt="${spot.name}" style="width: 100%; height: auto; margin-bottom: 10px;">
                        <strong>${spot.name}</strong><br>
                        <em>${spot.address}</em><br>
                        운영시간: ${spot.hours}<br>
                        ${spot.description}
                    </div>
                `;

                var infowindow = new kakao.maps.InfoWindow({
                    content: infowindowContent,
                    disableAutoPan: true
                });

                kakao.maps.event.addListener(marker, 'mouseover', function() {
                    infowindow.open(map, marker);
                });

                kakao.maps.event.addListener(marker, 'mouseout', function() {
                    infowindow.close();
                });

                map.markers.push(marker);
            });
        }

        addMarkers(tourismSpots);

        document.getElementById('search-input').addEventListener('input', function() {
            var query = this.value.toLowerCase();
            var filteredSpots = tourismSpots.filter(spot => 
                spot.name.toLowerCase().includes(query) || 
                spot.address.toLowerCase().includes(query)
            );
            addMarkers(filteredSpots);
        });

        document.getElementById('category-filter').addEventListener('change', function() {
            var category = this.value;
            var filteredSpots = category === 'all' ? tourismSpots : tourismSpots.filter(spot => spot.category === category);
            addMarkers(filteredSpots);
        });
    })
    .catch(error => console.error('Error fetching data:', error));
