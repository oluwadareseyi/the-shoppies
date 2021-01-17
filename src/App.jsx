import React from "react";
import Home from "./pages/home";
import { Route, Switch } from "react-router-dom";
import Nominees from "./pages/nominees";
import "./styles/app.scss";
import Nav from "./components/nav";

const pages = [
  { path: "/", pathName: "Home", Component: Home },
  { path: "/nominees", pathName: "Nominees", Component: Nominees },
];

const searchQuery =
  "http://www.omdbapi.com/?s=anime&type=movie&apikey=30035024";
const debounce = (callback, delay) => {
  let timeout;
  return function () {
    clearTimeout(timeout);
    timeout = setTimeout(callback, delay);
  };
};

function App() {
  return (
    <div className="pages container">
      <Nav />
      <Switch>
        {pages.map(({ path, Component }) => (
          <Route key={path} path={path} component={Component} exact />
        ))}
      </Switch>
    </div>
  );
}

export default App;
