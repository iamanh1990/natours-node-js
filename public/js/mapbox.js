export const displayMap = (locations) => {
  mapboxgl.accessToken =
    'pk.eyJ1IjoiaWFtYW5oIiwiYSI6ImNrbG0zaHJwZzA1ZjIydW8zcHFqMmw5eXUifQ.7SPSdtKh8edOYaLfXcYOEA';
  var map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/iamanh/cklm3mny52zy517o82ol9zkda',
    scrollZoom: false,
    //   center: [-118.113491, 34.111745],
    //   zoom: 10,
    //   interactive: false,
  });

  const bounds = new mapboxgl.LngLatBounds();
  locations.forEach((loc) => {
    //create marker
    const el = document.createElement('div');
    el.className = 'marker';
    //add marker
    new mapboxgl.Marker({
      element: el,
      anchor: 'bottom',
    })
      .setLngLat(loc.coordinates)
      .addTo(map);
    //Add popup
    new mapboxgl.Popup({ offset: 30 })
      .setLngLat(loc.coordinates)
      .setHTML(`<p>Day ${loc.day}: ${loc.description}</p>`)
      .addTo(map);
    //extend map bounds to include current location
    bounds.extend(loc.coordinates);
  });

  map.fitBounds(bounds, {
    padding: {
      top: 200,
      bottom: 200,
      left: 200,
      right: 100,
    },
  });
};
