import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    navbar: {
      main: "#d3d3d3", // Greyish navbar background color
      contrastText: "#000000", // Black text on navbar
    },
    text: {
      primary: "#000000", // Black text for nav items
    },
  },
});

export default theme;
