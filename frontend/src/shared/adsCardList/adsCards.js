import React from "react";
import Card from "@mui/material/Card"; // Import Material-UI Card component
import CardContent from "@mui/material/CardContent"; // Import Material-UI CardContent for card content
import Typography from "@mui/material/Typography"; // Import Material-UI Typography for text styling
import Box from "@mui/material/Box"; // Import Material-UI Box for layout and spacing
import { useTheme } from "@mui/material/styles"; // Import useTheme hook for accessing Material-UI theme

// AdsList Component: This component takes in a list of ads and renders them as cards
const AdsList = ({ ads }) => {
  const theme = useTheme(); // Access the Material-UI theme for consistent styling

  /* NOTE: COPY PASTE S FROM MATERIAL UI */
  return (
    <Box 
      sx={{ 
        display: "flex", // Use flexbox for layout
        flexDirection: "column", // Arrange cards in a column
        gap: 2, // Add space between each card
        mt: 3, // Add top margin to separate the list from other elements
      }}
    >
      {/* Iterate over the ads array to generate cards */}
      {ads.map((ad) => (
        <Card
          key={ad._id} // Unique key for each card (React requires this for lists)
          sx={{
            maxWidth: "100%", // Ensure the card spans the full width of its container
            padding: 2, 
            backgroundColor: theme.palette.grey[200], // Set a grayish background color from the theme
            boxShadow: theme.shadows[2], // Apply a slight shadow to make the card stand out
          }}
        >
          <CardContent>
            <Typography variant="h5" component="div" gutterBottom>
              {ad.title}
            </Typography>
            {/* Display the ad description in smaller text */}
            <Typography variant="body2" color="text.secondary">
              {ad.description}
            </Typography>
            {/* Show whether the ad is a Donation or Wishlist ad */}
            <Typography variant="caption" color="primary">
              {ad.items.some((item) => item.itemType === "DonationAd")
                ? "Donation Ad"
                : "Wishlist Ad"}
            </Typography>
          </CardContent>
        </Card>
      ))}
    </Box>
  );
};
  /* NOTE: COPY PASTE E FROM MATERIAL UI */

export default AdsList;
