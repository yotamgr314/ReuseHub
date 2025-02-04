import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Container, Typography, Grid, Card, CardActionArea, 
  CardContent, CircularProgress, Box, Divider 
} from "@mui/material";
import VolunteerActivismTwoToneIcon from "@mui/icons-material/VolunteerActivismTwoTone"; // Donation Ad icon
import StickyNote2TwoToneIcon from "@mui/icons-material/StickyNote2TwoTone"; // Wishlist Ad icon

const MyAds = () => {
  const [wishAds, setWishAds] = useState([]);
  const [donationAds, setDonationAds] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      console.error("No token found, redirecting to login...");
      navigate("/login");
      return;
    }

    const fetchMyAds = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/ads/myAds", {
          headers: { "Authorization": `Bearer ${token}` },
        });

        const data = await response.json();

        if (response.ok) {
          setWishAds(data.data.filter((ad) => ad.kind === "wishAd"));
          setDonationAds(data.data.filter((ad) => ad.kind === "donationAd"));
        } else {
          console.error("Failed to fetch ads:", data.message);
        }
      } catch (error) {
        console.error("Error fetching ads:", error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchMyAds();
  }, [navigate]);

  if (loading) {
    return (
      <Container maxWidth="md" sx={{ textAlign: "center", mt: 5 }}>
        <CircularProgress />
      </Container>
    );
  }

  return (
    <Container maxWidth="md">
      <Typography variant="h4" fontWeight="bold" sx={{ textAlign: "center", mb: 3 }}>
        My Ads
      </Typography>

      {/* Donation Ads Section */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h5" fontWeight="bold" sx={{ display: "flex", alignItems: "center", mb: 2 }}>
          <VolunteerActivismTwoToneIcon sx={{ mr: 1, color: "primary.main" }} /> My Donation Ads
        </Typography>
        <Grid container spacing={3}>
          {donationAds.length === 0 ? (
            <Typography variant="body1" color="textSecondary">
              No donation ads created yet.
            </Typography>
          ) : (
            donationAds.map((ad) => (
              <Grid item xs={12} sm={6} md={4} key={ad._id}>
                <Card sx={{ boxShadow: 3 }}>
                  <CardActionArea>
                    <CardContent>
                      <Typography variant="h6" fontWeight="medium">{ad.adTitle}</Typography>
                      <Typography variant="body2" color="textSecondary">{ad.category}</Typography>
                      <Typography variant="body2" color="textSecondary">Status: {ad.adStatus}</Typography>
                    </CardContent>
                  </CardActionArea>
                </Card>
              </Grid>
            ))
          )}
        </Grid>
      </Box>

      <Divider sx={{ my: 4 }} />

      {/* Wishlist Ads Section */}
      <Box>
        <Typography variant="h5" fontWeight="bold" sx={{ display: "flex", alignItems: "center", mb: 2 }}>
          <StickyNote2TwoToneIcon sx={{ mr: 1, color: "secondary.main" }} /> My Wishlist Ads
        </Typography>
        <Grid container spacing={3}>
          {wishAds.length === 0 ? (
            <Typography variant="body1" color="textSecondary">
              No wishlist ads created yet.
            </Typography>
          ) : (
            wishAds.map((ad) => (
              <Grid item xs={12} sm={6} md={4} key={ad._id}>
                <Card sx={{ boxShadow: 3 }}>
                  <CardActionArea>
                    <CardContent>
                      <Typography variant="h6" fontWeight="medium">{ad.adTitle}</Typography>
                      <Typography variant="body2" color="textSecondary">{ad.category}</Typography>
                      <Typography variant="body2" color="textSecondary">Urgency: {ad.urgency}</Typography>
                    </CardContent>
                  </CardActionArea>
                </Card>
              </Grid>
            ))
          )}
        </Grid>
      </Box>
    </Container>
  );
};

export default MyAds;
