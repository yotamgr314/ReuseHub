import React, { useState, useEffect } from "react";
import { io } from "socket.io-client";
import { GoogleMap, LoadScriptNext, OverlayView } from "@react-google-maps/api";
import StickyNote2TwoToneIcon from "@mui/icons-material/StickyNote2TwoTone";
import VolunteerActivismTwoToneIcon from "@mui/icons-material/VolunteerActivismTwoTone";
import AdsList from "../../shared/adsCardList/adsCards";

// Import CSS file
import "../homePage.css";

const HomePage = () => {
  const [ads, setAds] = useState([]);
  const [loading, setLoading] = useState(true); // Add loading state for better UX

  const defaultCenter = {
    // NOTE: Get default map center coordinates from environment variables (to Tel Aviv).
    lat: parseFloat(process.env.REACT_APP_DEFAULT_LAT),
    lng: parseFloat(process.env.REACT_APP_DEFAULT_LNG),
  };

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
      } finally {
        setLoading(false); // Stop loading spinner after ads are fetched
      }
    };

    fetchAds(); // NOTE: calling the function defined above.

    const socket = io("http://localhost:5000", {
      // NOTE: Connects the backend websocket server.
      transports: ["websocket", "polling"],
      path: "/socket.io",
    });

    /* NOTE: socket.on(event Name To Listen To, callback func to execute once the event emitted in the backend)
       01) it listens to backend event, name adCreated, and will commit a callback function each time the adCreated event is being emitted in the back end.
       02) our callback function also accept parameter from the server - called newAd.
       03) each time ad is being created the backend is gonna fire an emit called AdCreated, and pass a parameter along with it which contains the newly created ad.
       04) the callback function will execute and call setAds() to update the state of our ads with the newly created ad. 
    */

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

    socket.on("wishListAdCreated", (newAd) => {
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
      socket.off("wishListAdCreated");
      socket.disconnect();
    };
  }, []);

  return (
    <div>
      <h1>All Ads</h1>
      {loading ? (
        <p>Loading...</p> // Display a loading spinner or message
      ) : (
        // NOTE:  START OF N ADDED - GOOGLE CONTAINER + LOGIC 
        <LoadScriptNext googleMapsApiKey={process.env.REACT_APP_GOOGLE_MAPS_API_KEY}>
          <GoogleMap
            mapContainerStyle={{ width: "100%", height: "500px" }}
            center={defaultCenter}
            zoom={12}
          >
            {ads.map((ad) =>
              ad.location?.coordinates ? (
                <OverlayView
                  key={ad._id}
                  position={{
                    lat: ad.location.coordinates[1],
                    lng: ad.location.coordinates[0],
                  }}
                  mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET}
                >
                  {ad.items.some((item) => item.itemType === "DonationAd") ? (
                    <VolunteerActivismTwoToneIcon
                      className="donation-icon"
                      fontSize="large"
                    />
                  ) : (
                    <StickyNote2TwoToneIcon
                      className="wishlist-icon"
                      fontSize="large"
                    />
                  )}
                </OverlayView>
              ) : null
            )}
          </GoogleMap>
        </LoadScriptNext>
      )}
      {/* END OF GOOGLE MAPS SECTION */}
      
      <AdsList ads={ads} /> {/* Pass ads as props to AdsList */}
    </div>
  );
};

export default HomePage;
