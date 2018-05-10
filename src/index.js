import React from "react";
import { render } from "react-dom";
import { hot } from "react-hot-loader";

import {
  callAction,
  promise,
  observable,
  logActions,
  logState
} from "./lib/middleware";
import style from "./main.css";
import { incrementer } from "./lib/epics";
import { run, actions, timetravel } from "./actions";
import { App } from "./components/app";

const el = document.querySelector(".app");
const ReloadingApp = hot(module)(App);
run(state => render(<ReloadingApp {...state} />, el), [
  callAction,
  promise,
  observable(incrementer),
  timetravel.middleware,
  logActions,
  logState
]);
