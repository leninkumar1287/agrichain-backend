import React from 'react';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';

const containerStyle = {
  width: '100%',
  height: '400px'
};

const LocationMap = ({ location }) => {
  const center = {
    lat: location?.latitude || 0,
    lng: location?.longitude || 0
  };

  return (
    <LoadScript googleMapsApiKey={process.env.REACT_APP_GOOGLE_MAPS_API_KEY}>
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={center}
        zoom={15}
      >
        {location && (
          <Marker
            position={center}
            title="Farm Location"
          />
        )}
      </GoogleMap>
    </LoadScript>
  );
};

export default LocationMap; 