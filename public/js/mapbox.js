/* eslint-disable */
export const displayMap = locations => {
    mapboxgl.accessToken = document.getElementById('map-token').dataset.token;

    // https://docs.mapbox.com/mapbox-gl-js/api/map/
    const map = new mapboxgl.Map({
        container: 'map',
        scrollZoom: false,
        style: 'mapbox://styles/eudzeo72cfsfs3peudcq/cl2e4h0yo001r16rw1u1w66pc',
        // bearing: 0,
        // center: [-95.0, 39.0],
        // interactive: false,
        // pitch: 50,
        // zoom: 3.5,
    });

    // https://docs.mapbox.com/mapbox-gl-js/api/geography/#lnglatbounds
    const bounds = new mapboxgl.LngLatBounds();

    // add marker to map for each location
    locations.forEach(loc => {
        const element = document.createElement('div');
        element.className = 'marker';

        // https://docs.mapbox.com/mapbox-gl-js/api/markers/#marker
        new mapboxgl.Marker({
            element,
            anchor: 'bottom',
        })
            .setLngLat(loc.coordinates)
            .addTo(map);

        // https://docs.mapbox.com/mapbox-gl-js/api/markers/#popup
        new mapboxgl.Popup({
            offset: 30,
        })
            .setLngLat(loc.coordinates)
            .setHTML(`<p>Day ${loc.day}: ${loc.description}</p>`)
            .addTo(map);

        // extend map bounds to include current location
        bounds.extend(loc.coordinates);
    });

    // https://docs.mapbox.com/mapbox-gl-js/api/map/#map#fitbounds
    map.fitBounds(bounds, {
        padding: {
            top: 200,
            bottom: 150,
            left: 100,
            right: 100,
        },
    });
};
