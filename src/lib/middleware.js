import Rx from "rxjs/Rx";

import { middleware } from "../actions";

export const { callAction } = middleware;

export const promise = (action, next) =>
  typeof action.result.then == "function"
    ? action.result.then(result => next({ ...action, result }))
    : next(action);

export const observable = (...epics) => {
  const action$ = new Rx.Subject();
  epics.map(epic => epic(action$).subscribe(v => v));
  return (action, next) => {
    const result = next(action);
    action$.next(action);
    return result;
  };
};

export const logActions = (action, next) => (
  console.log("action", JSON.stringify(action)), next(action)
);

export const logState = (action, next) => (
  next(action), _ => console.log("state", JSON.stringify(state))
);
