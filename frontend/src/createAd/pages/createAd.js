// frontend/src/createAd/pages/createAd.js
import React, { useState, useEffect } from "react";
import { Container, Box, Typography, Grid, Card, CardActionArea, CardContent } from "@mui/material";
import { useNavigate } from "react-router-dom";
import StickyNote2TwoToneIcon from "@mui/icons-material/StickyNote2TwoTone"; // Wishlist Ad icon
import VolunteerActivismTwoToneIcon from "@mui/icons-material/VolunteerActivismTwoTone"; // Donation Ad icon
import DonationAdForm from "../components/donationAdForm";
import WishAdForm from "../components/wishAdForm";
import { jwtDecode } from "jwt-decode";

const CreateAd = () => {
  const [adType, setAdType] = useState(null); // "donationAd" or "wishAd"
  const navigate = useNavigate();
  const [token, setToken] = useState(localStorage.getItem("token"));

  // Validate token and redirect if expired
  useEffect(() => {
    if (!token) {
      navigate("/login");
    } else {
      try {
        const decodedToken = jwtDecode(token);
        const currentTime = Date.now() / 1000;
        if (decodedToken.exp < currentTime) {
          localStorage.removeItem("token");
          navigate("/login");
        }
      } catch (err) {
        localStorage.removeItem("token");
        navigate("/login");
      }
    }
  }, [navigate, token]);

  return (
    <Container maxWidth="md">
      <Box sx={{ marginTop: 5, textAlign: "center" }}>
        {!adType ? (
          <Grid container spacing={3} justifyContent="center" sx={{ marginTop: 4 }}>
            {/* Donation Ad Card */}
            <Grid item xs={12} sm={6}>
              <Card
                onClick={() => setAdType("donationAd")}
                sx={{
                  cursor: "pointer",
                  boxShadow: 3,
                  transition: "0.3s",
                  "&:hover": { boxShadow: 6, transform: "scale(1.05)", backgroundColor: "#f0f0f0" },
                }}
              >
                <CardActionArea>
                  <CardContent sx={{ py: 4, display: "flex", flexDirection: "column", alignItems: "center" }}>
                    <VolunteerActivismTwoToneIcon sx={{ fontSize: 50, color: "primary.main", mb: 1 }} />
                    <Typography variant="h5" fontWeight="medium"> Donation Ad</Typography>
                  </CardContent>
                </CardActionArea>
              </Card>
            </Grid>

            {/* Wish Ad Card */}
            <Grid item xs={12} sm={6}>
              <Card
                onClick={() => setAdType("wishAd")}
                sx={{
                  cursor: "pointer",
                  boxShadow: 3,
                  transition: "0.3s",
                  "&:hover": { boxShadow: 6, transform: "scale(1.05)", backgroundColor: "#f0f0f0" },
                }}
              >
                <CardActionArea>
                  <CardContent sx={{ py: 4, display: "flex", flexDirection: "column", alignItems: "center" }}>
                    <StickyNote2TwoToneIcon sx={{ fontSize: 50, color: "secondary.main", mb: 1 }} />
                    <Typography variant="h5" fontWeight="medium">Wish Ad</Typography>
                  </CardContent>
                </CardActionArea>
              </Card>
            </Grid>
          </Grid>
        ) : (
          <Box sx={{ mt: 5 }}>
            {adType === "donationAd" ? <DonationAdForm token={token} navigate={navigate} /> : <WishAdForm token={token} navigate={navigate} />}
          </Box>
        )}
      </Box>
    </Container>
  );
};

export default CreateAd;