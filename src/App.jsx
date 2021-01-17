import React from "react";
import Home from "./pages/home";
import { Route, Switch } from "react-router-dom";
import "./styles/app.scss";

const pages = [
  { path: "/", pathName: "Home", Component: Home },
];

function App() {
  return (
    <div className="pages">
      <Switch>
        {pages.map(({ path, Component }) => (
          <Route key={path} path={path} component={Component} exact />
        ))}
      </Switch>
    </div>
  );
}

export default App;
