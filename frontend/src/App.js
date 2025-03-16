// frontend/app.js
import React from "react";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
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
import NotificationManager from "./offers/components/NotificationManager"; // הוספת הרכיב

const App = () => {
  return (
    <BrowserRouter>
      <DrawerAppBar />
      {/* NotificationManager מופיע כאן – כך הוא זמין בכל העמודים */}
      <NotificationManager />
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
    </BrowserRouter>
  );
};

export default App;
