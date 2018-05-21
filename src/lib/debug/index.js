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
  states: { init: copy(state) },
  actions: [{ id: "init", type: "init", endTime: new Date() }],
  ...extra
});

export const debug = (getTrackingState, setTrackingState) => {
  const { run, actions, getState } = mount(initState(getTrackingState()), {
    enabled: {
      toggle: state => !state
    },
    clearActions: ({ enabled }) => initState(getTrackingState(), { enabled }),
    addAction: (action, state) => ({
      ...state,
      actions: [...state.actions, action]
    }),
    addState: (action, resultState, state) => {
      state.actions.find(a => a.id == action.id).endTime = new Date();
      return {
        ...state,
        states: {
          ...state.states,
          [action.id]: resultState
        },
        current: Object.keys(state.states).length
      };
    },
    moveToState: (n, state) => {
      setTrackingState(copy(state.states[state.actions[n].id]));
      return { ...state, current: n };
    }
  });

  document.addEventListener("keypress", function({ keyCode, ctrlKey }) {
    if (keyCode == 4 && ctrlKey) {
      actions.enabled.toggle();
    }
  });

  function timetravel(mws) {
    return [
      (action, next) => {
        if (getState().current < Object.keys(getState().states).length - 1) {
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
