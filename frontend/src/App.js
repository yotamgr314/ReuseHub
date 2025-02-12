// frontend/app.js
// NOTE: THE STARTING POINT OF OUR APPLICATION
import React from "react";
import { BrowserRouter, Route, Routes, Navigate} from "react-router-dom"; // NOTE to control component rendering based on URL.

import DrawerAppBar from "./shared/ulElements/drawerAppBar"; // NOTE Material UI component - KEREN recommended

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




// THIS SECTION TAKES CARE OF RENDERING COMPONENTS BASED ON THE URL.(by BrowserRouter,Router,Route)
const App = () => {
  return (
    <BrowserRouter>
      <DrawerAppBar />
      <Routes>
      <Route path="/homePage" element={<JwtRouteGuard> <HomePage /> </JwtRouteGuard>} />
      <Route path="/createAd" element={<JwtRouteGuard> <CreateAd /> </JwtRouteGuard>} />
      <Route path="/chat" element={<JwtRouteGuard><ChatList /></JwtRouteGuard>} />
      <Route path="/myAds" element={<JwtRouteGuard> <MyAds /> </JwtRouteGuard>} /> 
      <Route path="/chat/:chatId" element={<JwtRouteGuard><Chat /></JwtRouteGuard>} />
      <Route path="/chat" element={<JwtRouteGuard><Chat /></JwtRouteGuard>} />
      <Route path="/myOffers" element={<JwtRouteGuard> <Offers/></JwtRouteGuard>} />
      <Route path="/leaderBoard" element={<JwtRouteGuard><LeaderBoard /></JwtRouteGuard>} />
      <Route path="/register" element={<Register />} />
      <Route path="/login" element={<Login />} />
      <Route path="*" element={<Navigate to="/homePage" />} />
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
NOTE: each route which is wrapped with <JwtRouteGuard> component will be passed a props (propery) to him. inside the <JwtRouteGuard> component we check if the localStorage exists.
*/