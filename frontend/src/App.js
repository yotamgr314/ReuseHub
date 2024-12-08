// NOTE: THE STARTING POINT OF OUR APPLICATION
import React from "react";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom"; // NOTE to control component rendering based on URL.

import DrawerAppBar from "./shared/ulElements/drawerAppBar"; // NOTE Material UI component - KEREN recommended

import HomePage from "./homePage/pages/homePage.js";
import MyAds from "./ads/pages/myAds.js";
import IncomingOffers from "./offers/pages/incomingOffers.js";
import IncomingClaims from "./claimRequests/pages/incomingClaims.js";
import LeaderBoard from "./leaderboard/pages/leaderboard.js";
import Register from "./registration/pages/register.js";

// THIS SECTION TAKES CARE OF RENDERING COMPONENTS BASED ON THE URL.(by BrowserRouter,Router,Route)
const App = () => {
  return (
    <BrowserRouter>
      <DrawerAppBar />
      <Routes>
        <Route path="/homePage" element={<HomePage />} />
        <Route path="/myAds" element={<MyAds />} />
        <Route path="/incomingOffers" element={<IncomingOffers />} />
        <Route path="/incomingClaims" element={<IncomingClaims />} />
        <Route path="/leaderBoard" element={<LeaderBoard />} />
        <Route path="/LogOut" element={<Register />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
/* 
react component explanations:
NOTE: <BrowserRouter> -  we must wrap all our pages inside browserRouter to enable rendering them based on URL.
NOTE: <Routes> - Ensures that in case of multiple routes matching it will only render the most specifc one.
NOTE: <Route path="/" element={<HomePage />} /> - when use will type the url http://localhost:3000/ it will render the homePage, and similarly for  <Route path="/myAds" element={<MyAdsPage />} /> if we type http://localhost:3000/myAds it will render myAds page component.
NOTE: <Route path="*" element={<Navigate to="/" />} /> - will render the homepage for any unmatched paths. 



*/
