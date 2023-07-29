const resultsPerPage = 20;
let currentPage = 1;
let totalResults = 0;
let results = [];

function initMap() {
    const map = new google.maps.Map(document.getElementById('map'), {
        center: { lat: 0, lng: 0 },
        zoom: 12
    });

    function fetchNearbyRestaurants(userLocation) {
        map.setCenter(userLocation);

        const service = new google.maps.places.PlacesService(map);

        const request = {
            location: userLocation,
            radius: 10000,
            type: ['restaurant']
        };

        service.nearbySearch(request, (results, status) => {
            if (status === google.maps.places.PlacesServiceStatus.OK) {
                totalResults = Math.min(results.length, 100);
                this.results = results.slice(0, totalResults);
                currentPage = 1;
                showPage(currentPage);
            }
        });
    }

    function showPage(page) {
        const startIndex = (page - 1) * resultsPerPage;
        const endIndex = startIndex + resultsPerPage;
        const currentPageResults = this.results.slice(startIndex, endIndex);

        const restaurantList = document.getElementById('restaurant-list');
        restaurantList.innerHTML = ''; 

        currentPageResults.forEach(restaurant => {
            const restaurantDiv = document.createElement('div');
            restaurantDiv.classList.add('restaurant');

            restaurantDiv.innerHTML = `
                <img src="${restaurant.photos && restaurant.photos[0].getUrl() || 'https://www.flaticon.com/free-icon/placeholder_1377194'}" alt="${restaurant.name}">
                <h3>${restaurant.name}</h3>
                <p>Rating: ${restaurant.rating || 'N/A'}</p>
            `;

            restaurantList.appendChild(restaurantDiv);

            new google.maps.Marker({
                position: restaurant.geometry.location,
                map: map,
                title: restaurant.name
            });
        });

        const prevBtn = document.getElementById('prev-btn');
        const nextBtn = document.getElementById('next-btn');
        prevBtn.disabled = page === 1;
        nextBtn.disabled = page === Math.ceil(totalResults / resultsPerPage);
    }

    function changePage(change) {
        currentPage += change;
        showPage(currentPage);
    }

    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const userLocation = {
                    lat: position.coords.latitude,
                    lng: position.coords.longitude
                };
                fetchNearbyRestaurants(userLocation);
            },
            (error) => {
                console.error('Error getting user location:', error);
            }
        );
    } else {
        console.error('Geolocation is not supported by this browser.');
    }
}
