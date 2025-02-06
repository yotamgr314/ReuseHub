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
  const token = localStorage.getItem("token"); // No need for setToken, just use token

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
    <Container maxWidth="lg">
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "80vh" }}>
        {!adType ? (
          <Grid container spacing={4} justifyContent="center" sx={{ display: "flex", flexDirection: "row" }}>
            {/* Donation Ad Card */}
            <Grid item xs={12} sm={6} md={5}> {/* Cards now stand side by side */}
              <Card
                onClick={() => setAdType("donationAd")}
                sx={{
                  cursor: "pointer",
                  boxShadow: 4,
                  borderRadius: 3,
                  width: "100%",
                  height: 250, // Increased height
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                  transition: "0.3s",
                  backgroundColor: "white",
                  "&:hover": { boxShadow: 8, transform: "scale(1.05)", backgroundColor: "#f8f8f8" },
                }}
              >
                <CardActionArea sx={{ width: "100%", height: "100%" }}> {/* Makes the entire card clickable */}
                  <CardContent sx={{ py: 5, display: "flex", flexDirection: "column", alignItems: "center" }}>
                    <VolunteerActivismTwoToneIcon sx={{ fontSize: 80, color: "primary.main", mb: 2 }} />
                    <Typography variant="h4" fontWeight="bold">Donation Ad</Typography>
                  </CardContent>
                </CardActionArea>
              </Card>
            </Grid>

            {/* Wish Ad Card */}
            <Grid item xs={12} sm={6} md={5}> {/* Cards now stand side by side */}
              <Card
                onClick={() => setAdType("wishAd")}
                sx={{
                  cursor: "pointer",
                  boxShadow: 4,
                  borderRadius: 3,
                  width: "100%",
                  height: 250, // Increased height
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                  transition: "0.3s",
                  backgroundColor: "white",
                  "&:hover": { boxShadow: 8, transform: "scale(1.05)", backgroundColor: "#f8f8f8" },
                }}
              >
                <CardActionArea sx={{ width: "100%", height: "100%" }}> {/* Makes the entire card clickable */}
                  <CardContent sx={{ py: 5, display: "flex", flexDirection: "column", alignItems: "center" }}>
                    <StickyNote2TwoToneIcon sx={{ fontSize: 80, color: "secondary.main", mb: 2 }} />
                    <Typography variant="h4" fontWeight="bold">Wish Ad</Typography>
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
