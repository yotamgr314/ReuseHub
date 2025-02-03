import React, { useState } from "react";
import { Container, Typography, Grid, Card, CardActionArea, CardContent } from "@mui/material";
import { useNavigate } from "react-router-dom";
import DonationAdForm from "../components/donationAdForm";
import WishAdForm from "../components/wishAdForm";

const CreateAd = () => {
  const [adType, setAdType] = useState(null);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  return (
    <Container maxWidth="md">
      <Typography variant="h4" sx={{ textAlign: "center", mt: 3 }}>Create an Ad</Typography>

      {!adType ? (
        <Grid container spacing={3} justifyContent="center">
          <Grid item xs={12} sm={6}>
            <Card onClick={() => setAdType("donationAd")} sx={{ cursor: "pointer", boxShadow: 3 }}>
              <CardActionArea>
                <CardContent>
                  <Typography variant="h5">Create a Donation Ad</Typography>
                </CardContent>
              </CardActionArea>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Card onClick={() => setAdType("wishAd")} sx={{ cursor: "pointer", boxShadow: 3 }}>
              <CardActionArea>
                <CardContent>
                  <Typography variant="h5">Make a Wish</Typography>
                </CardContent>
              </CardActionArea>
            </Card>
          </Grid>
        </Grid>
      ) : adType === "donationAd" ? (
        <DonationAdForm token={token} navigate={navigate} />
      ) : (
        <WishAdForm token={token} navigate={navigate} />
      )}
    </Container>
  );
};

export default CreateAd;
