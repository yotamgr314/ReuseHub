import React, { useState, useEffect } from "react";
import { io } from "socket.io-client";
import AdsList from "../../shared/adsCardList/adsCards";
import GoogleMapComponent from "../components/googleMap";
import AdModalDisplay from "../components/adModalDisplay";

const HomePage = () => {
  const [ads, setAds] = useState([]);
  const [selectedAd, setSelectedAd] = useState(null);

  useEffect(() => {
    const fetchAds = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch("http://localhost:5000/api/ads", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        const responseData = await response.json();
        if (response.ok && Array.isArray(responseData.data)) {
          setAds(responseData.data);
        } else {
          console.error("Unexpected API response format", responseData);
          setAds([]);
        }
      } catch (err) {
        console.error("Error fetching ads:", err);
        setAds([]);
      }
    };

    fetchAds();

    const socket = io("http://localhost:5000");

    socket.on("donationAdCreated", (newAd) => {
      if (newAd && newAd._id) {
        setAds((prevAds) => {
          const adExists = prevAds.some((ad) => ad._id === newAd._id);
          if (!adExists) {
            return [newAd, ...prevAds];
          }
          return prevAds;
        });
      }
    });


    

    socket.on("wishAdCreated", (newAd) => {
      if (newAd && newAd._id) {
        setAds((prevAds) => {
          const adExists = prevAds.some((ad) => ad._id === newAd._id);
          if (!adExists) {
            return [newAd, ...prevAds];
          }
          return prevAds;
        });
      }
    });

    return () => {
      socket.off("donationAdCreated");
      socket.off("wishAdCreated");
      socket.disconnect();
    };
  }, []);

  return (
    <div style={{ padding: "20px", maxWidth: "95vw", margin: "auto" }}>
      <h1 style={{ textAlign: "center", fontSize: "2rem", marginBottom: "20px" }}></h1>

      {/* Google Map - Full Width */}
      <div style={{ borderRadius: "12px", overflow: "hidden", boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)", width: "100%" }}>
        <GoogleMapComponent ads={ads} onSelectAd={setSelectedAd} />
      </div>

      {/* Ads List - Clickable */}
      <AdsList ads={ads} onSelectAd={setSelectedAd} />

      {/* Ad Modal Display */}
      {selectedAd && <AdModalDisplay selectedAd={selectedAd} onClose={() => setSelectedAd(null)} />}
    </div>
  );
};

export default HomePage;
