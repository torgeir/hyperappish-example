import { mount } from "hyperappish";

import { debug } from "./lib/debug";
import { state } from "./state";

const wait = s => new Promise(resolve => setTimeout(resolve, s * 1000));

const ops = {
  incrementer: {
    start: state => ({ ...state, incrementing: true }),
    increment: (n, state) => ({ ...state, n: state.n + n }),
    stop: state => ({ ...state, incrementing: false })
  },
  selection: {
    select: user => ({ user }),
    remove: () => ({ user: null })
  },
  users: {
    fetching: (fetching, state) => ({ ...state, fetching }),
    list: function(state) {
      this.fetching(true);
      return wait(2)
        .then(_ => fetch("https://jsonplaceholder.typicode.com/users"))
        .then(res => res.json())
        .then(users => users.map(({ id, name }) => ({ id, name })).slice(0, 2))
        .then(list => (this.fetching(false), list))
        .then(list => ({ ...state, list }));
    }
  }
};

export const { run, actions, setState, middleware } = mount(state, ops);

export const timetravel = debug(state, actions, setState);
