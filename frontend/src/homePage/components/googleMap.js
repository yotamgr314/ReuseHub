import React, { useState, useEffect } from "react";
import { GoogleMap, LoadScriptNext, OverlayView, Marker } from "@react-google-maps/api";
import { useNavigate } from "react-router-dom";
import StickyNote2TwoToneIcon from "@mui/icons-material/StickyNote2TwoTone"; 
import VolunteerActivismTwoToneIcon from "@mui/icons-material/VolunteerActivismTwoTone"; 
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline"; 
import AdModalDisplay from "./adModalDisplay"; 
import { Fab, Tooltip } from "@mui/material";

const GoogleMapComponent = ({ ads, onSelectAd }) => {
  const [userLocation, setUserLocation] = useState(null);
  const [mapAds, setMapAds] = useState([]);
  const [selectedAd, setSelectedAd] = useState(null);
  const navigate = useNavigate();

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
      <div style={{ position: "relative" }}>
        <GoogleMap
          mapContainerStyle={{ width: "100%", height: "500px", borderRadius: "12px", boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)" }}
          center={userLocation || { lat: 32.08088, lng: 34.81429 }}
          zoom={12}
        >
          {userLocation && <Marker position={userLocation} />}

          {mapAds.map((ad) =>
            ad.location?.coordinates ? (
              <OverlayView
                key={ad._id}
                position={{ lat: ad.location.coordinates[1], lng: ad.location.coordinates[0] }}
                mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET}
              >
                {ad.kind === "donationAd" ? (
                  <VolunteerActivismTwoToneIcon
                    fontSize="large"
                    style={{ color: "blue", cursor: "pointer" }}
                    onClick={() => {
                      setSelectedAd(ad);
                      onSelectAd(ad);
                    }}
                  />
                ) : (
                  <StickyNote2TwoToneIcon
                    fontSize="large"
                    style={{ color: "green", cursor: "pointer" }}
                    onClick={() => {
                      setSelectedAd(ad);
                      onSelectAd(ad);
                    }}
                  />
                )}
              </OverlayView>
            ) : null
          )}
        </GoogleMap>

        {/* Floating "Create Ad" Button (MOVED TO LEFT SIDE) */}
        <Tooltip title="Create Ad" arrow>
          <Fab
            color="primary"
            aria-label="create ad"
            sx={{
              position: "absolute",
              bottom: 25,
              left: 25,  // ← MOVED TO LEFT
              width: 80,
              height: 80,
              backgroundColor: "#1976D2",
              "&:hover": { backgroundColor: "#1565C0" },
              boxShadow: 4,
            }}
            onClick={() => navigate("/createAd")}
          >
            <AddCircleOutlineIcon sx={{ fontSize: 40 }} />
          </Fab>
        </Tooltip>

        {selectedAd && <AdModalDisplay selectedAd={selectedAd} onClose={() => setSelectedAd(null)} />}
      </div>
    </LoadScriptNext>
  );
};

export default GoogleMapComponent;
