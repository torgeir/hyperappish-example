import Rx from "rxjs/Rx";

const doto = (o, fn) => (fn(o), o);

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
  console.log("action", JSON.stringify(action.type, null, 2)), next(action)
);

export const logState = getState => (action, next) =>
  doto(next(action), () => console.log("state", JSON.stringify(getState())));
