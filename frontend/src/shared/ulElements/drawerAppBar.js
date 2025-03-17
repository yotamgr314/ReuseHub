// frontend/src/shared/ulElements/drawerAppBar.js
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
import HomeIcon from "@mui/icons-material/Home";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import ViewListIcon from "@mui/icons-material/ViewList";
import OfferIcon from "@mui/icons-material/LocalOffer";
import ChatIcon from "@mui/icons-material/Chat";
import LeaderboardIcon from "@mui/icons-material/Leaderboard";
import LogoutIcon from "@mui/icons-material/Logout";
import { NavLink, useNavigate, useLocation } from "react-router-dom";
import { handleLogout } from "../utilis/handleLogout";

const drawerWidth = 240;

const navItems = [
  { label: "HOME", path: "/homePage", type: "link", icon: <HomeIcon /> },
  { label: "CREATE AD", path: "/createAd", type: "link", icon: <AddCircleIcon /> },
  { label: "MY ADS", path: "/myAds", type: "link", icon: <ViewListIcon /> },
  { label: "MY OFFERS", path: "/myOffers", type: "link", icon: <OfferIcon /> },
  { label: "CHAT", path: "/chat", type: "chat", icon: <ChatIcon /> },
  { label: "LEADERBOARD", path: "/leaderBoard", type: "link", icon: <LeaderboardIcon /> },
  { label: "LOG OUT", type: "action", icon: <LogoutIcon /> },
];

export default function DrawerAppBar(props) {
  const { window } = props;
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // Hide navbar on these routes
  const hideAppBarRoutes = ["/register", "/login"];
  if (hideAppBarRoutes.includes(location.pathname)) {
    return null;
  }

  const handleDrawerToggle = () => {
    setMobileOpen((prevState) => !prevState);
  };

  const handleChatNavigation = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/chat", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      const data = await response.json();
      if (response.ok && data.data.length > 0) {
        navigate("/chat");
      } else {
        alert("No active chats found. Please start a conversation.");
      }
    } catch (error) {
      console.error("Error fetching chats:", error);
      alert("Unable to load chats. Please try again.");
    }
  };

  // Retrieve user data from localStorage
  let user = {};
  try {
    user = JSON.parse(localStorage.getItem("user")) || {};
  } catch (error) {
    console.error("Error parsing user data from localStorage:", error);
  }

  // Determine the profile picture URL.
  // If the stored URL does not start with "http", prepend the backend URL.
  // Also, use a placeholder that works reliably.
  const profilePic =
    user.profilePic && user.profilePic !== ""
      ? (user.profilePic.startsWith("http")
          ? user.profilePic
          : `http://localhost:5000${user.profilePic}`)
      : "https://via.placeholder.com/40?text=Avatar";

  const drawer = (
    <Box onClick={handleDrawerToggle} sx={{ textAlign: "center" }}>
      <Typography
        variant="h6"
        sx={{ my: 2, cursor: "pointer" }}
        onClick={() => navigate("/homePage")}
      >
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
                  {item.icon}
                  <ListItemText primary={item.label} sx={{ ml: 1 }} />
                </NavLink>
              </ListItemButton>
            ) : item.type === "chat" ? (
              <ListItemButton sx={{ textAlign: "center", py: 2 }} onClick={handleChatNavigation}>
                {item.icon}
                <ListItemText primary={item.label} sx={{ ml: 1 }} />
              </ListItemButton>
            ) : (
              <ListItemButton
                sx={{ textAlign: "center", py: 2 }}
                onClick={() => handleLogout(navigate)}
              >
                {item.icon}
                <ListItemText primary={item.label} sx={{ ml: 1 }} />
              </ListItemButton>
            )}
          </ListItem>
        ))}
      </List>
    </Box>
  );

  const container = window !== undefined ? () => window().document.body : undefined;

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
            onClick={() => navigate("/homePage")}
            sx={{
              flexGrow: 1,
              display: { xs: "none", sm: "block" },
              cursor: "pointer",
            }}
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
                    {item.icon}
                    {item.label}
                  </NavLink>
                </Button>
              ) : item.type === "chat" ? (
                <Button key={item.label} onClick={handleChatNavigation} sx={{ color: "text.primary" }}>
                  {item.icon}
                  {item.label}
                </Button>
              ) : (
                <Button
                  key={item.label}
                  onClick={() => handleLogout(navigate)}
                  sx={{ color: "text.primary" }}
                >
                  {item.icon}
                  {item.label}
                </Button>
              )
            )}
          </Box>
          {/* Display the user's profile picture */}
          <Avatar
            alt={user.firstName || "User"}
            src={profilePic}
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
