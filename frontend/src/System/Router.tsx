import React, { FunctionComponent } from "react";
import { Route, Switch } from "react-router-dom";

import Status from "./Status";
import Tasks from "./Tasks";
import Providers from "./Providers";
import Logs from "./Logs";

const Router: FunctionComponent = () => {
  return (
    <Switch>
      <Route exact path="/system/tasks">
        <Tasks></Tasks>
      </Route>
      <Route exact path="/system/status">
        <Status></Status>
      </Route>
      <Route exact path="/system/providers">
        <Providers></Providers>
      </Route>
      <Route exact path="/system/logs">
        <Logs></Logs>
      </Route>
    </Switch>
  );
};

export default Router;