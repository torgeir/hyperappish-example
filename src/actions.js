import { mount } from "hyperappish";

import { push, replace, listen } from "./lib/history";
import { debug } from "./lib/debug/";
import { encode, decode } from "./lib/url";
import { state } from "./state";

const doto = (o, fn) => (fn(o), o);
const after = (fn, after) => (...args) =>
  doto(fn(...args), () => setTimeout(() => after(...args)));

const ops = {
  location: {
    set: (path, query) => ({ path, query }),
    go: after(
      (path, query) => ({ path, query }),
      (path, query) => push(path + encode(query))
    ),
    clearUser: (_, actions) => actions.location.go("/users", {}),
    selectUser: (user, _, actions) =>
      actions.location.go(`/users/${user.id}`, {})
  },
  incrementer: {
    start: state => ({ ...state, incrementing: true }),
    increment: (n, state) => ({ ...state, n: state.n + n }),
    decrement: (n, state) => ({ ...state, n: state.n - n }),
    stop: state => ({ ...state, incrementing: false })
  },
  users: {
    fetching: (fetching, state) => ({ ...state, fetching }),
    list: function(state) {
      this.fetching(true);
      return fetch("https://jsonplaceholder.typicode.com/users")
        .then(res => res.json())
        .then(users => users.map(({ id, name }) => ({ id, name })))
        .then(list => ({ ...state, fetching: false, list }))
        .catch(error => ({ ...state, fetching: false, error }));
    }
  }
};

export const { run, actions, getState, setState, middleware } = mount(
  state,
  ops
);

listen(({ pathname, search }, action) => {
  if (action === "POP") {
    actions.location.set(pathname, decode(search));
  }
});

export const timetravel = debug(getState, state => {
  replace(state.location.path + encode(state.location.query));
  setState(state);
});

window.getState = getState;
