import React, { useState, useEffect } from "react";
import { GoogleMap, LoadScriptNext, Marker } from "@react-google-maps/api";
import RoomIcon from "@mui/icons-material/Room"; // ✅ אייקון של משתמש

const GoogleMapComponent = ({ ads }) => {
  const [userLocation, setUserLocation] = useState(null);

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
          console.warn("⚠️ המשתמש לא אישר גישה למיקום. שימוש במיקום דיפולטי.");
          setUserLocation({ lat: 32.08088, lng: 34.81429 }); // רמת גן כברירת מחדל
        }
      );
    } else {
      console.warn("⚠️ Geolocation לא נתמך בדפדפן זה.");
      setUserLocation({ lat: 32.08088, lng: 34.81429 });
    }
  }, []);

  return (
    <LoadScriptNext googleMapsApiKey={process.env.REACT_APP_GOOGLE_MAPS_API_KEY}>
      <GoogleMap
        mapContainerStyle={{ width: "100%", height: "500px" }}
        center={userLocation || { lat: 32.08088, lng: 34.81429 }}
        zoom={12}
      >
        {/* ✅ מרקר של המשתמש */}
        {userLocation && (
          <Marker
            position={userLocation}
            icon={{
              url: "http://maps.google.com/mapfiles/ms/icons/blue-dot.png", // 🔹 אייקון בצבע כחול
              scaledSize: new window.google.maps.Size(40, 40), // שינוי גודל האייקון
            }}
          />
        )}

        {/* ✅ מרקרים לכל המודעות */}
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
