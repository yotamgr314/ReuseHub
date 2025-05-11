// app.js

// frontend/src/App.js
import React from "react";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { Box } from "@mui/material";
import DrawerAppBar from "./shared/ulElements/drawerAppBar";
import HomePage from "./homePage/pages/homePage.js";
import CreateAd from "./createAd/pages/createAd.js";
import MyAds from "./ads/pages/myAds.js";
import Offers from "./offers/pages/offers.js";
import Chat from "./chat/pages/chat.js";
import LeaderBoard from "./leaderboard/pages/leaderboard.js";
import Register from "./registration/pages/register.js";
import Login from "./login/pages/login.js";
import JwtRouteGuard from "./shared/jwt/jwtRouteGuard.js";
import ChatList from "./chat/pages/chatList.js";
import NotificationManager from "./offers/components/NotificationManager";
import Footer from "./shared/ulElements/footer"; // <-- Updated Footer component

const App = () => {
  return (
    <BrowserRouter>
      <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
        <DrawerAppBar />
        <NotificationManager />

        <Box sx={{ flexGrow: 1 }}>
          <Routes>
            <Route path="/homePage" element={<JwtRouteGuard><HomePage /></JwtRouteGuard>} />
            <Route path="/createAd" element={<JwtRouteGuard><CreateAd /></JwtRouteGuard>} />
            <Route path="/chat" element={<JwtRouteGuard><ChatList /></JwtRouteGuard>} />
            <Route path="/myAds" element={<JwtRouteGuard><MyAds /></JwtRouteGuard>} />
            <Route path="/chat/:chatId" element={<JwtRouteGuard><Chat /></JwtRouteGuard>} />
            <Route path="/chat" element={<JwtRouteGuard><Chat /></JwtRouteGuard>} />
            <Route path="/myOffers" element={<JwtRouteGuard><Offers /></JwtRouteGuard>} />
            <Route path="/leaderBoard" element={<JwtRouteGuard><LeaderBoard /></JwtRouteGuard>} />
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
            <Route path="*" element={<Navigate to="/homePage" />} />
          </Routes>
        </Box>
        <Footer />
      </Box>
    </BrowserRouter>
  );
};

export default App;