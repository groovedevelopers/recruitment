import React, { Suspense } from "react";
import {
  BrowserRouter as Router,
  Switch,
  useHistory,
  Redirect,
  Route,
} from "react-router-dom";
import Home from "./pages/home";

const App = () => {
  return (
    <Router>
      <Suspense fallback={<div>Loading...</div>}>
        <Switch>

          <Route exact path="/">
            <Redirect to="/home"  />
          </Route>
          <Route path="/home" exact component={Home} />


        </Switch>
      </Suspense>

      
    </Router>
  );
}

export default App;
