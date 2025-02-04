import React, { useState, useEffect } from "react";
import { GoogleMap, LoadScriptNext, OverlayView, Marker } from "@react-google-maps/api";
import { Modal, Box, Typography, IconButton, ImageList, ImageListItem, Card, CardContent, CardMedia, Grid } from "@mui/material";
import StickyNote2TwoToneIcon from "@mui/icons-material/StickyNote2TwoTone"; // Wishlist Ad icon
import VolunteerActivismTwoToneIcon from "@mui/icons-material/VolunteerActivismTwoTone"; // Donation Ad icon
import CloseIcon from "@mui/icons-material/Close";

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

  const handleAdClick = (ad) => {
    setSelectedAd(ad);
  };

  const handleCloseModal = () => {
    setSelectedAd(null);
  };

  return (
    <LoadScriptNext googleMapsApiKey={process.env.REACT_APP_GOOGLE_MAPS_API_KEY}>
      <GoogleMap
        mapContainerStyle={{ width: "100%", height: "500px" }}
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
                  onClick={() => handleAdClick(ad)}
                />
              ) : (
                <StickyNote2TwoToneIcon
                  fontSize="large"
                  style={{ color: "green", cursor: "pointer" }}
                  onClick={() => handleAdClick(ad)}
                />
              )}
            </OverlayView>
          ) : null
        )}
      </GoogleMap>

      {/* MODAL WITH IMPROVED STYLING */}
      <Modal open={Boolean(selectedAd)} onClose={handleCloseModal} closeAfterTransition>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 480,
            bgcolor: "background.paper",
            boxShadow: 24,
            p: 3,
            borderRadius: 3,
          }}
        >
          {selectedAd && (
            <Card sx={{ boxShadow: 3 }}>
              <CardContent sx={{ position: "relative", p: 3 }}>
                <IconButton
                  onClick={handleCloseModal}
                  sx={{ position: "absolute", top: 10, right: 10, color: "gray" }}
                >
                  <CloseIcon />
                </IconButton>

                <Typography variant="h5" fontWeight="bold" sx={{ mb: 1 }}>
                  {selectedAd.adTitle}
                </Typography>

                <Typography variant="body1" color="textSecondary" sx={{ mb: 2 }}>
                  {selectedAd.adDescription}
                </Typography>

                {/* Display images if available */}
                {selectedAd.kind === "donationAd" && selectedAd.items?.images?.length > 0 && (
                  <ImageList cols={selectedAd.items.images.length > 1 ? 2 : 1} rowHeight={140} sx={{ mb: 2 }}>
                    {selectedAd.items.images.map((imgUrl, index) => (
                      <ImageListItem key={index}>
                        <CardMedia
                          component="img"
                          height="140"
                          image={imgUrl}
                          alt={`Ad Image ${index}`}
                          sx={{ borderRadius: 2 }}
                        />
                      </ImageListItem>
                    ))}
                  </ImageList>
                )}

                {/* Grid Layout for Cleaner Details */}
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <Typography variant="body2">
                      <strong>Category:</strong> {selectedAd.category}
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="body2">
                      <strong>Amount:</strong> {selectedAd.amount}
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="body2">
                      <strong>Item:</strong> {selectedAd.items?.name || "N/A"}
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="body2">
                      <strong>Item Description:</strong> {selectedAd.items?.description || "N/A"}
                    </Typography>
                  </Grid>

                  {selectedAd.kind === "donationAd" ? (
                    <>
                      <Grid item xs={6}>
                        <Typography variant="body2">
                          <strong>Condition:</strong> {selectedAd.itemCondition || "N/A"}
                        </Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography variant="body2">
                          <strong>Method:</strong> {selectedAd.donationMethod || "N/A"}
                        </Typography>
                      </Grid>
                      <Grid item xs={12}>
                        <Typography variant="body2">
                          <strong>Status:</strong> {selectedAd.adStatus}
                        </Typography>
                      </Grid>
                    </>
                  ) : (
                    <Grid item xs={12}>
                      <Typography variant="body2">
                        <strong>Urgency:</strong> {selectedAd.urgency}
                      </Typography>
                    </Grid>
                  )}
                </Grid>
              </CardContent>
            </Card>
          )}
        </Box>
      </Modal>
    </LoadScriptNext>
  );
};

export default GoogleMapComponent;
