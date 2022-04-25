import React from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import Claims from "./components/claims/Claims";
import Leaves from "./components/leaves/Leaves";
import ButtonAppBar from "./components/common/Navibar";
import BasicCard from "./components/profile/Home";
import MyCalendar from "./components/calendar/Calendar";
import LoginPage from "./components/login/LoginPage";
import ProfilePage from "./components/profile/ProfilePage";
import { LoginSessionContext } from "./components/login/LoginSessionContext";

function App() {
  return (
    <div>
      <Router>
        <Switch>
          <Route exact path="/" component={LoginPage} />
          <LoginSessionContext.Provider>
            <ButtonAppBar></ButtonAppBar>
            <Route path="/Index" component={LoginPage} />
            <Route path="/Home" component={BasicCard} />
            <Route path="/Claims" component={Claims} />
            <Route path="/Leaves" component={Leaves} />
            <Route path="/Calendar" component={MyCalendar} />
            <Route path="/Profile" component={ProfilePage} />
          </LoginSessionContext.Provider>
        </Switch>
      </Router>
    </div>
  );
}
export default App;
