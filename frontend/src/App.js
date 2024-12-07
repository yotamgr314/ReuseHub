import React from "react";
import {
  BrowserRouter as Router,
  Route,
  Redirect,
  Switch,
} from "react-router-dom";

// THIS SECTION TAKES CARE OF RENDERING COMPONENTS BASED ON THE URL.(by BrowserRouter,Router,Route)
const App = () => {
  return (
    <Router>
      <Switch>
        <Route path="/" exact></Route>
        <Route path="/places/new" exact></Route>
        <Redirect to="/" />
      </Switch>
    </Router>
  );
};

export default App;
