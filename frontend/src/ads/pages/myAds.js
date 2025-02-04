import React, { useEffect, useState } from "react";
import {
  Container,
  Typography,
  Grid,
  Card,
  CardActionArea,
  CardContent,
  CircularProgress,
  Box,
  Divider,
  Fade,
} from "@mui/material";
import VolunteerActivismTwoToneIcon from "@mui/icons-material/VolunteerActivismTwoTone"; // Donation Ad icon
import StickyNote2TwoToneIcon from "@mui/icons-material/StickyNote2TwoTone"; // Wishlist Ad icon

const MyAds = () => {
  const [wishAds, setWishAds] = useState([]);
  const [donationAds, setDonationAds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(localStorage.getItem("token") || "");

  useEffect(() => {
    if (!token) {
      console.error("No token found, authentication required.");
      setLoading(false);
      return;
    }

    const fetchMyAds = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/ads/myAds", {
          method: "GET",
          headers: { 
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Failed to fetch ads");
        }

        setWishAds(data.data.filter((ad) => ad.kind === "wishAd"));
        setDonationAds(data.data.filter((ad) => ad.kind === "donationAd"));
      } catch (error) {
        console.error("Error fetching ads:", error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchMyAds();
  }, [token]);

  if (loading) {
    return (
      <Container maxWidth="md" sx={{ textAlign: "center", mt: 5 }}>
        <CircularProgress />
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ mt: 5 }}>
      <Typography variant="h4" fontWeight="bold" sx={{ textAlign: "center", mb: 4 }}>
        My Ads
      </Typography>

      {/* Donation Ads Section */}
      <Box sx={{ mb: 6 }}>
        <Typography variant="h5" fontWeight="bold" sx={{ display: "flex", alignItems: "center", mb: 3, color: "primary.main" }}>
          <VolunteerActivismTwoToneIcon sx={{ mr: 1, fontSize: 32 }} /> My Donation Ads
        </Typography>
        <Grid container spacing={3}>
          {donationAds.length === 0 ? (
            <Typography variant="body1" color="textSecondary">
              No donation ads created yet.
            </Typography>
          ) : (
            donationAds.map((ad) => (
              <Grid item xs={12} sm={6} md={4} key={ad._id}>
                <Fade in timeout={500}>
                  <Card
                    sx={{
                      boxShadow: 3,
                      borderRadius: 2,
                      transition: "transform 0.3s ease-in-out",
                      "&:hover": { transform: "scale(1.05)" },
                    }}
                  >
                    <CardActionArea>
                      <CardContent>
                        <Typography variant="h6" fontWeight="medium">{ad.adTitle}</Typography>
                        <Typography variant="body2" color="textSecondary">{ad.category}</Typography>
                        <Typography variant="body2" color="primary">Status: {ad.adStatus}</Typography>
                      </CardContent>
                    </CardActionArea>
                  </Card>
                </Fade>
              </Grid>
            ))
          )}
        </Grid>
      </Box>

      <Divider sx={{ my: 5 }} />

      {/* Wishlist Ads Section */}
      <Box>
        <Typography variant="h5" fontWeight="bold" sx={{ display: "flex", alignItems: "center", mb: 3, color: "secondary.main" }}>
          <StickyNote2TwoToneIcon sx={{ mr: 1, fontSize: 32 }} /> My Wishlist Ads
        </Typography>
        <Grid container spacing={3}>
          {wishAds.length === 0 ? (
            <Typography variant="body1" color="textSecondary">
              No wishlist ads created yet.
            </Typography>
          ) : (
            wishAds.map((ad) => (
              <Grid item xs={12} sm={6} md={4} key={ad._id}>
                <Fade in timeout={500}>
                  <Card
                    sx={{
                      boxShadow: 3,
                      borderRadius: 2,
                      transition: "transform 0.3s ease-in-out",
                      "&:hover": { transform: "scale(1.05)" },
                    }}
                  >
                    <CardActionArea>
                      <CardContent>
                        <Typography variant="h6" fontWeight="medium">{ad.adTitle}</Typography>
                        <Typography variant="body2" color="textSecondary">{ad.category}</Typography>
                        <Typography variant="body2" color="secondary">Urgency: {ad.urgency}</Typography>
                      </CardContent>
                    </CardActionArea>
                  </Card>
                </Fade>
              </Grid>
            ))
          )}
        </Grid>
      </Box>
    </Container>
  );
};

export default MyAds;
