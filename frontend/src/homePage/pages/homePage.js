import React, { useState, useEffect } from "react";
import { io } from "socket.io-client";
import AdsList from "../components/ads-list";

const HomePage = () => {
  const [ads, setAds] = useState([]); // NOTE empty array means that the state - aka ads is an array.

  useEffect(() => {
    // WILL GET EXECUTED ONCE AFTER THE PAGE REFRESH (AKA AFTER HomePage components mounts.)
    const fetchAds = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/ads");
        const responseData = await response.json();
    
        // Ensure the data field contains an array
        if (responseData.success && Array.isArray(responseData.data)) {
          setAds(responseData.data); // Set ads to the fetched array
        } else {
          console.error("Unexpected API response format", responseData);
          setAds([]); // Reset to empty array in case of unexpected response
        }
      } catch (err) {
        console.error("Error fetching ads:", err);
        setAds([]); // Reset to empty array in case of an error
      }
    };
    
    fetchAds(); /// NOTE: calling the function defined above.

    const socket = io("http://localhost:5000", {     // NOTE: connects the backend websocket server.
      transports: ["websocket", "polling"],
      path: "/socket.io",
    });

    /* NOTE: socket.on(event Name To Listen To, callback func to execute once the event emitted in the backend)
             01) it listens to backend event, name adCreated, and will commit a callback function each time the adCreated event is being emitted in the back end.
             02) our callback function also accept parameter from the server - called newAd.
             02) each time ad is being created the backend is gonna fire an emitt called AdCreated, and pass a parameter along with it which contains the newly created ad.
             04) the callback function will execute and call setAds() to update the state of our ads with the newly created ad. 
    */

             socket.on("donationAdCreated", (newAd) => {
              if (newAd && newAd._id) {
                setAds((prevAds) => [newAd, ...prevAds]);
              } else {
                console.error("Invalid ad received from WebSocket:", newAd);
              }
            });
            
    return () => {
      socket.off("donationAdCreated");
      socket.disconnect(); // return statement means Cleanup function - this function will runs when the component is unmounted, here will disconnect from the socket which listens to events.
    };
  }, []);

  return (
    <div>
      <h1>All Ads</h1>
      <AdsList ads={ads} />
    </div>
  );
};

export default HomePage;