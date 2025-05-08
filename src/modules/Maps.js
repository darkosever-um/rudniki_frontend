import React from 'react';
import { GoogleMap, useJsApiLoader, Marker } from '@react-google-maps/api';

const containerStyle = {
  width: '100%',
  height: '100vh',
};

const center = {
  lat: 46.1512,
  lng: 14.9955
};

const options = {
    disableDefaultUI: true,
    zoomControl: false,
    streetViewControl: false,
    mapTypeControl: false,
    fullscreenControl: false,
  };

function Maps({ mines }) {
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY
  });

  if (!isLoaded) return <div>Loading Map...</div>;

  return (
    <GoogleMap
      mapContainerStyle={containerStyle}
      center={center}
      zoom={8}
      options={options}
    >
        {mines.map((mine, index) => (
        <Marker
          key={index}
          position={{ lat: mine.lat, lng: mine.lon }}
          title={mine.ime}
        />
      ))}
    </GoogleMap>
  );
}

export default Maps;