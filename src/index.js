import React from "react";
import { render } from "react-dom";
import { hot } from "react-hot-loader";

import "./reset.css";
import router from "./router";
import { App } from "./components/app";
import { replace } from "./lib/history";
import { incrementer } from "./lib/epics";
import { run, actions, getState, middleware, timetravel } from "./actions";
import { promise, observable, logActions, logState } from "./lib/middleware";

const ReloadingApp = hot(module)(App),
  el = document.querySelector(".app"),
  middlewares = timetravel([
    logActions,
    middleware.callAction,
    promise,
    observable(incrementer),
    logState(getState)
  ]);

run(async state => {
  const page = await router.resolve({ pathname: state.location.path });
  if (page.redirect) {
    actions.location.set(page.redirect, {});
    return replace(page.redirect);
  }
  return render(<ReloadingApp>{page(state)}</ReloadingApp>, el);
}, middlewares);
