import React from "react";
import { Card, CardContent, Typography, Grid, IconButton } from "@mui/material";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";

const AdsList = ({ ads, onSelectAd }) => {
  return (
    <Grid container spacing={2} sx={{ marginTop: 2, width: "100%" }}>
      {ads.map((ad) => (
        <Grid item xs={12} key={ad._id}>
          <Card
            onClick={() => onSelectAd(ad)}
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "12px",
              cursor: "pointer",
              transition: "0.2s",
              boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)",
              "&:hover": {
                boxShadow: "0px 6px 12px rgba(0, 0, 0, 0.2)",
                transform: "scale(1.02)",
              },
            }}
          >
            <CardContent sx={{ flexGrow: 1 }}>
              <Typography variant="h6" fontWeight="bold">
                {ad.adTitle}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                {ad.adDescription}
              </Typography>
            </CardContent>
            {/* Right Arrow Icon */}
            <IconButton edge="end" aria-label="view details">
              <ArrowForwardIosIcon sx={{ fontSize: 20, color: "gray" }} />
            </IconButton>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
};

export default AdsList;
