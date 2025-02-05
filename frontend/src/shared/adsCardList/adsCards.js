// frontend/src/shared/adsCards.js
import React from "react";
import Card from "@mui/material/Card"; 
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import { useTheme } from "@mui/material/styles";

const AdsList = ({ ads = [] }) => {  //  Ensure ads is always an array
  const theme = useTheme();

  return (
    <Box 
      sx={{ 
        display: "flex",
        flexDirection: "column",
        gap: 2,
        mt: 3,
      }}
    >
      {ads.length === 0 ? (
        <Typography variant="h6" color="text.secondary">
          No ads available.
        </Typography>
      ) : (
        ads.map((ad) => (
          <Card
            key={ad._id || Math.random()} //  Prevent React key errors
            sx={{
              maxWidth: "100%",
              padding: 2,
              backgroundColor: theme.palette.grey[200],
              boxShadow: theme.shadows[2],
            }}
          >
            <CardContent>
              <Typography variant="h5" component="div" gutterBottom>
                {ad.adTitle}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {ad.adDescription}
              </Typography>
              <Typography variant="caption" color="primary">
                {ad.kind === "donationAd" ? "Donation Ad" : "Wishlist Ad"}
              </Typography>
            </CardContent>
          </Card>
        ))
      )}
    </Box>
  );
};

export default AdsList;
