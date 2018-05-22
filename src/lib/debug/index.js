import React from "react";
import { mount } from "hyperappish";
import { ActionList } from "./components";

const copy = s => {
  try {
    return JSON.parse(JSON.stringify(s));
  } catch (e) {
    throw new Error(`could not parse ${s} to json, got ${e}`);
  }
};

const initState = (state, extra = {}) => ({
  enabled: true,
  current: 0,
  states: { "-1": copy(state) },
  actions: [{ id: -1, type: "init", endTime: new Date() }],
  ...extra
});

export const debug = (getTrackingState, setTrackingState) => {
  const { run, actions, getState } = mount(initState(getTrackingState()), {
    enabled: {
      toggle: state => !state
    },
    clearActions: ({ enabled }) => initState(getTrackingState(), { enabled }),
    addAction: (action, state) => {
      const actions = [...state.actions, action];
      return {
        ...state,
        actions,
        current: actions.length - 1
      };
    },
    addState: (action, resultState, state) => {
      state.actions.find(a => a.id == action.id).endTime = new Date();
      return {
        ...state,
        states: {
          ...state.states,
          [action.id]: resultState
        }
      };
    },
    moveToState: (n, state) => {
      setTrackingState(
        copy(
          state.states[
            state.actions.slice().sort((a, b) => a.endTime - b.endTime)[n].id
          ]
        )
      );
      return { ...state, current: n };
    }
  });

  document.addEventListener("keypress", function({ keyCode, ctrlKey }) {
    if (keyCode == 4 && ctrlKey) {
      actions.enabled.toggle();
    }
  });

  const maxBy = ([first, ...rest], fn) =>
    rest.reduce((acc, el) => (fn(el) > fn(acc) ? el : acc), first);

  const lastAction = actions =>
    actions.slice().sort((a, b) => a.endTime - b.endTime)[actions.length - 1];

  function timetravel(mws) {
    return [
      (action, next) => {
        const s = getState();
        if (s.current < s.actions.indexOf(lastAction(s.actions))) {
          return console.warn(
            "Viewing an historic state, skipping new actions until you move to the last one"
          );
        }

        actions.addAction(action);
        return next(action);
      },
      ...mws,
      (action, next) => {
        const result = next(action);
        actions.addState(action, copy(getTrackingState()));
        return result;
      }
    ];
  }

  timetravel.View = ({ children }) => (
    <ActionList run={run} actions={actions}>
      {children}
    </ActionList>
  );

  return timetravel;
};
