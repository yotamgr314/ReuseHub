// frontend/src/homePage/components/GoogleMapComponent.js
import React from "react";
import { GoogleMap, LoadScriptNext, Marker } from "@react-google-maps/api";

const GoogleMapComponent = ({ ads }) => {
  const defaultCenter = {
    lat: parseFloat(process.env.REACT_APP_DEFAULT_LAT),
    lng: parseFloat(process.env.REACT_APP_DEFAULT_LNG),
  };

  return (
    <LoadScriptNext googleMapsApiKey={process.env.REACT_APP_GOOGLE_MAPS_API_KEY}>
      <GoogleMap mapContainerStyle={{ width: "100%", height: "500px" }} center={defaultCenter} zoom={12}>
        {ads.map((ad) =>
          ad.location?.coordinates ? (
            <Marker
              key={ad._id}
              position={{ lat: ad.location.coordinates[1], lng: ad.location.coordinates[0] }}
            />
          ) : null
        )}
      </GoogleMap>
    </LoadScriptNext>
  );
};

export default GoogleMapComponent;
