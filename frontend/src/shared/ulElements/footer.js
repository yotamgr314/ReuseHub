// FOOTER.JS
// frontend/src/shared/ulElements/Footer.js
import React from "react";
import { Box, Typography, IconButton, Stack } from "@mui/material";
import { useTheme, useMediaQuery } from "@mui/material";
import FacebookIcon from "@mui/icons-material/Facebook";
import TwitterIcon from "@mui/icons-material/Twitter";
import InstagramIcon from "@mui/icons-material/Instagram";

const Footer = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <Box
      component="footer"
      sx={{
        width: "100%",
        bgcolor: "#f5f5f5",
        py: 2,
        borderTop: "1px solid #ddd",
      }}
    >
      <Stack
        direction={isMobile ? "column" : "row"}
        alignItems="center"
        justifyContent="space-between"
        sx={{ width: "100%", px: 2 }} // px adds horizontal padding
      >
        <Typography variant="body2" color="text.secondary" sx={{ textAlign: isMobile ? "center" : "left" }}>
          © 2025 ReuseHub. All rights reserved.
        </Typography>
        <Box sx={{ display: "flex", gap: 2 }}>
          <IconButton color="inherit">
            <FacebookIcon />
          </IconButton>
          <IconButton color="inherit">
            <TwitterIcon />
          </IconButton>
          <IconButton color="inherit">
            <InstagramIcon />
          </IconButton>
        </Box>
      </Stack>
    </Box>
  );
};

export default Footer;
