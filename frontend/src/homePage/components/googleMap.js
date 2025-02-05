// frontend/src/homePage/components/googleMap.js
import React, { useState, useEffect } from "react";
import { GoogleMap, LoadScriptNext, OverlayView, Marker } from "@react-google-maps/api";
import StickyNote2TwoToneIcon from "@mui/icons-material/StickyNote2TwoTone"; // Wishlist Ad icon
import VolunteerActivismTwoToneIcon from "@mui/icons-material/VolunteerActivismTwoTone"; // Donation Ad icon
import AdModalDisplay from "./adModalDisplay"; // ✅ Updated import

const GoogleMapComponent = ({ ads }) => {
  const [userLocation, setUserLocation] = useState(null);
  const [mapAds, setMapAds] = useState([]);
  const [selectedAd, setSelectedAd] = useState(null);

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
          setUserLocation({ lat: 32.08088, lng: 34.81429 }); 
        }
      );
    } else {
      console.warn("⚠️ Geolocation is not supported.");
      setUserLocation({ lat: 32.08088, lng: 34.81429 });
    }
  }, []);

  useEffect(() => {
    setMapAds(ads);
  }, [ads]);

  return (
    <LoadScriptNext googleMapsApiKey={process.env.REACT_APP_GOOGLE_MAPS_API_KEY}>
      <GoogleMap mapContainerStyle={{ width: "100%", height: "500px" }} center={userLocation || { lat: 32.08088, lng: 34.81429 }} zoom={12}>
        {userLocation && <Marker position={userLocation} />}

        {mapAds.map((ad) =>
          ad.location?.coordinates ? (
            <OverlayView
              key={ad._id}
              position={{ lat: ad.location.coordinates[1], lng: ad.location.coordinates[0] }}
              mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET}
            >
              {ad.kind === "donationAd" ? (
                <VolunteerActivismTwoToneIcon fontSize="large" style={{ color: "blue", cursor: "pointer" }} onClick={() => setSelectedAd(ad)} />
              ) : (
                <StickyNote2TwoToneIcon fontSize="large" style={{ color: "green", cursor: "pointer" }} onClick={() => setSelectedAd(ad)} />
              )}
            </OverlayView>
          ) : null
        )}
      </GoogleMap>

      {/* Use the new AdModalDisplay component */}
      <AdModalDisplay selectedAd={selectedAd} onClose={() => setSelectedAd(null)} />
    </LoadScriptNext>
  );
};

export default GoogleMapComponent;
