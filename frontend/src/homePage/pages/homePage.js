// frontend/src/homePage/pages/homePage.js
import React, { useState, useEffect } from "react";
import { io } from "socket.io-client";
import AdsList from "../../shared/adsCardList/adsCards";
import GoogleMapComponent from "../components/googleMap";

const HomePage = () => {
  const [ads, setAds] = useState([]);

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
    <div>
      <h1>All Ads</h1>
      <GoogleMapComponent ads={ads} />
      <AdsList ads={ads} />
    </div>
  );
};

export default HomePage;