import React, { useState, useEffect } from "react";
import { GoogleMap, LoadScriptNext, OverlayView, Marker } from "@react-google-maps/api";
import StickyNote2TwoToneIcon from "@mui/icons-material/StickyNote2TwoTone"; // Wishlist Ad icon
import VolunteerActivismTwoToneIcon from "@mui/icons-material/VolunteerActivismTwoTone"; // Donation Ad icon

const GoogleMapComponent = ({ ads }) => {
  const [userLocation, setUserLocation] = useState(null);
  const [mapAds, setMapAds] = useState([]); // Stores ads for the map

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        () => {
          console.warn("⚠️ User denied location access. Defaulting to Ramat Gan.");
          setUserLocation({ lat: 32.08088, lng: 34.81429 }); // Default: Ramat Gan
        }
      );
    } else {
      console.warn("⚠️ Geolocation is not supported.");
      setUserLocation({ lat: 32.08088, lng: 34.81429 });
    }
  }, []);

  // ✅ Watch for new ads and update map markers
  useEffect(() => {
    setMapAds(ads);
  }, [ads]);

  return (
    <LoadScriptNext googleMapsApiKey={process.env.REACT_APP_GOOGLE_MAPS_API_KEY}>
      <GoogleMap
        mapContainerStyle={{ width: "100%", height: "500px" }}
        center={userLocation || { lat: 32.08088, lng: 34.81429 }}
        zoom={12}
      >
        {/* ✅ Default red Google Maps marker for user location */}
        {userLocation && <Marker position={userLocation} />}

        {/* ✅ Custom Material UI icons for ads */}
        {mapAds.map((ad) =>
          ad.location?.coordinates ? (
            <OverlayView
              key={ad._id}
              position={{ lat: ad.location.coordinates[1], lng: ad.location.coordinates[0] }}
              mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET}
            >
              {ad.kind === "donationAd" ? (
                <VolunteerActivismTwoToneIcon
                  className="donation-icon"
                  fontSize="large"
                  style={{ color: "blue" }}
                />
              ) : (
                <StickyNote2TwoToneIcon
                  className="wishlist-icon"
                  fontSize="large"
                  style={{ color: "green" }}
                />
              )}
            </OverlayView>
          ) : null
        )}
      </GoogleMap>
    </LoadScriptNext>
  );
};

export default GoogleMapComponent;
