import React from "react";
import { mount, getIn } from "hyperappish";

const copy = s => {
  try {
    return JSON.parse(JSON.stringify(s));
  } catch (e) {
    throw new Error(`could not parse ${s} to json, got ${e}`);
  }
};

const initState = (state, extra = {}) => ({
  enabled: false,
  states: {
    list: [copy(state)],
    current: 0
  },
  actions: {
    list: [{ type: "init" }]
  },
  ...extra
});

export const debug = (trackingState, trackingActions, setTrackingState) => {
  const debugState = initState(trackingState);

  const debugOps = {
    enabled: {
      toggle: state => !state
    },
    clear: state => initState(trackingState, { enabled: state.enabled }),
    states: {
      add: (s, state) => ({
        ...state,
        list: [...state.list, s],
        current: state.list.length
      }),
      moveTo: (n, state) => {
        trackingState = setTrackingState(copy(state.list[n]));
        return { ...state, current: n };
      }
    },
    actions: {
      add: (action, state) => {
        return { ...state, list: [...state.list, action] };
      }
    }
  };

  const { run, actions: debugActions, middleware } = mount(
    debugState,
    debugOps
  );

  document.addEventListener("keypress", function({ keyCode, ctrlKey }) {
    if (keyCode == 4 && ctrlKey) {
      debugActions.enabled.toggle();
    }
  });

  class ActionArgs extends React.Component {
    constructor() {
      super();
      this.state = { open: false };
    }

    render() {
      const { args } = this.props;
      if (args.length == 0) {
        return <span />;
      }
      return this.state.open ? (
        args.map(JSON.stringify)
      ) : (
        <span onClick={() => this.setState({ open: true })}>...</span>
      );
    }
  }

  const Action = ({
    disabled,
    selected,
    onClick = v => v,
    action: { type, args = [] }
  }) => (
    <div
      onClick={onClick}
      style={{
        backgroundColor: selected ? "#dedede" : "inherit",
        padding: "0.5rem 0.75rem",
        cursor: "pointer"
      }}
    >
      <span
        style={{
          color: disabled ? "#999" : "inherit"
        }}
      >
        <code>
          {type}(<ActionArgs args={args} />)
        </code>
      </span>
    </div>
  );

  class ActionList extends React.Component {
    constructor() {
      super();
      this.state = {
        states: [],
        actions: [],
        current: 0
      };
    }

    componentDidMount() {
      run(({ enabled, states, actions }) =>
        this.setState({
          enabled,
          states: states.list,
          current: states.current,
          actions: actions.list
        })
      );
    }

    componentWillUnmount() {
      // stop();
    }

    render() {
      const { enabled, states, current, actions } = this.state;
      if (!enabled) {
        return null;
      }
      const numStates = states.length - 1;
      return (
        <div
          style={{
            position: "absolute",
            top: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "#fefefe",
            color: "#333",
            width: "15rem",
            overflowY: "scroll"
          }}
        >
          <div
            style={{
              padding: "0.5rem"
            }}
          >
            <span>Actions fired: {actions.length} </span>
            {actions.length > 1 ? (
              <button onClick={() => debugActions.clear()}>Clear</button>
            ) : null}
            {current < numStates ? (
              <button onClick={() => debugActions.states.moveTo(numStates)}>
                Resume
              </button>
            ) : null}
          </div>
          <ul style={{ listStyleType: "none", margin: 0, padding: 0 }}>
            {states.map(
              (state, i) =>
                actions[i] ? (
                  <li key={i} style={{ margin: 0, padding: 0 }}>
                    <Action
                      action={actions[i]}
                      selected={i == current}
                      disabled={i > current}
                      onClick={() => debugActions.states.moveTo(i)}
                    />
                  </li>
                ) : null
            )}
          </ul>
        </div>
      );
    }
  }

  return {
    ActionList,

    middleware: function(action, next) {
      if (!debugState.enabled) {
        return next(action);
      }

      if (debugState.states.current < debugState.states.list.length - 1) {
        console.warn(
          "Viewing an historic state, skipping new actions until you move to the last one"
        );
        return;
      }
      const result = next(action);
      debugActions.actions.add(action);
      debugActions.states.add(copy(trackingState));
      return result;
    }
  };
};
