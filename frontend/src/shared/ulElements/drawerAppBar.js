import React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import CssBaseline from "@mui/material/CssBaseline";
import Divider from "@mui/material/Divider";
import Drawer from "@mui/material/Drawer";
import IconButton from "@mui/material/IconButton";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import MenuIcon from "@mui/icons-material/Menu";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Avatar from "@mui/material/Avatar";
import { NavLink, useNavigate } from "react-router-dom"; // Import useNavigate for redirect
import { handleLogout } from "../utilis/handleLogout"; // Import logout logic

const drawerWidth = 240;

const navItems = [
  { label: "CREATE AD", path: "/createAd", type: "link" },
  { label: "MY ADS", path: "/myAds", type: "link" },
  { label: "INCOMING OFFERS", path: "/incomingOffers", type: "link" },
  { label: "INCOMING CLAIMS", path: "/incomingClaims", type: "link" },
  { label: "LEADERBOARD", path: "/leaderBoard", type: "link" },
  { label: "LOG OUT", type: "action" }, // LOG OUT as an action
];

export default function DrawerAppBar(props) {
  const { window } = props;
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const navigate = useNavigate(); // Initialize navigate

  const handleDrawerToggle = () => {
    setMobileOpen((prevState) => !prevState);
  };

  const drawer = (
    <Box onClick={handleDrawerToggle} sx={{ textAlign: "center" }}>
      <Typography variant="h6" sx={{ my: 2 }}>
        ReuseHub
      </Typography>
      <Divider />
      <List>
        {navItems.map((item) => (
          <ListItem key={item.label} disablePadding sx={{ mb: 2.5 }}>
            {item.type === "link" ? (
              <ListItemButton sx={{ textAlign: "center", py: 2 }}>
                <NavLink
                  to={item.path}
                  style={({ isActive }) => ({
                    textDecoration: "none",
                    color: isActive ? "blue" : "inherit",
                    fontWeight: isActive ? "bold" : "normal",
                  })}
                >
                  <ListItemText primary={item.label} />
                </NavLink>
              </ListItemButton>
            ) : (
              <ListItemButton
                sx={{ textAlign: "center", py: 2 }}
                onClick={() => handleLogout(navigate)} // Call centralized logout function which will delete the jwt token from the localStorage.
              >
                <ListItemText primary={item.label} />
              </ListItemButton>
            )}
          </ListItem>
        ))}
      </List>
    </Box>
  );

  const container =
    window !== undefined ? () => window().document.body : undefined;

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <AppBar component="nav" color="navbar">
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: "none" } }}
          >
            <MenuIcon />
          </IconButton>
          <Typography
            variant="h6"
            component="div"
            sx={{ flexGrow: 1, display: { xs: "none", sm: "block" } }}
          >
            ReuseHub
          </Typography>
          <Box sx={{ display: { xs: "none", sm: "flex" }, gap: 1.5 }}>
            {navItems.map((item) =>
              item.type === "link" ? (
                <Button key={item.label} sx={{ color: "text.primary" }}>
                  <NavLink
                    to={item.path}
                    style={({ isActive }) => ({
                      textDecoration: "none",
                      color: isActive ? "blue" : "inherit",
                      fontWeight: isActive ? "bold" : "normal",
                    })}
                  >
                    {item.label}
                  </NavLink>
                </Button>
              ) : (
                <Button
                  key={item.label}
                  onClick={() => handleLogout(navigate)}
                  sx={{ color: "text.primary" }}
                >
                  {item.label}
                </Button>
              )
            )}
          </Box>
          <Avatar
            alt="Profile Picture"
            src="https://gratisography.com/wp-content/uploads/2024/10/gratisography-cool-cat-800x525.jpg"
            sx={{ width: 40, height: 40, ml: 2 }}
          />
        </Toolbar>
      </AppBar>
      <nav>
        <Drawer
          container={container}
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{ keepMounted: true }}
          sx={{
            display: { xs: "block", sm: "none" },
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: drawerWidth,
            },
          }}
        >
          {drawer}
        </Drawer>
      </nav>
      <Box component="main" sx={{ p: 3 }}>
        <Toolbar />
      </Box>
    </Box>
  );
}
