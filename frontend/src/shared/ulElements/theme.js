import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    navbar: {
      main: "#d3d3d3", 
      contrastText: "#000000", 
    },
    text: {
      primary: "#000000", 
    },
  },
});

export default theme;