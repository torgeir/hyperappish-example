import React from "react";

const ActionArgs = ({ args }) =>
  args.length == 0 ? <span /> : args.map(JSON.stringify);

const Action = ({
  disabled,
  selected,
  onClick = v => v,
  action: { id, type, args = [] },
  state
}) => (
  <div
    onClick={onClick}
    style={{
      wordBreak: "break-all",
      backgroundColor: selected ? "#dedede" : "inherit",
      padding: "0.5rem 0.75rem",
      cursor: "pointer"
    }}>
    <code style={{ color: disabled ? "#999" : "inherit" }}>
      {type}(<ActionArgs args={args} />)<br />
    </code>
    <State selected={selected} state={state} />
  </div>
);

class State extends React.Component {
  constructor() {
    super();
    this.state = {};
  }
  render() {
    const { open } = this.state;
    const { state, prefix = "" } = this.props;
    return (
      <div style={{ padding: "0.5rem 0 0.5rem 1rem" }}>
        <div style={{ textAlign: "right" }}>
          <span
            onClick={e => {
              this.setState({ open: !open });
              e.stopPropagation();
            }}>
            {open ? "hide" : "show"} {prefix} state
          </span>
        </div>
        {open && <pre>{JSON.stringify(state, null, 2)}</pre>}
      </div>
    );
  }
}

export class ActionList extends React.Component {
  constructor() {
    super();
    this.state = {
      states: [],
      actions: [],
      current: 0
    };
  }

  componentDidMount() {
    this.props.run(state => this.setState(state));
  }

  componentWillUnmount() {
    // stop();
  }

  render() {
    const { enabled, states, current, actions } = this.state;
    const { children, actions: debugActions } = this.props;
    if (!enabled) {
      return children;
    }
    const numActions = actions.length - 1;
    return (
      <div
        style={{
          display: "grid",
          gridTemplate: "'a b' 1fr / 1fr 30rem",
          backgroundColor: "#fefefe",
          color: "#333"
        }}>
        <div>{children}</div>
        <div
          style={{
            position: "fixed",
            right: 0,
            width: "30rem",
            height: "100vh",
            backgroundColor: "#fefefe",
            borderLeft: "1px solid grey",
            overflowY: "scroll"
          }}>
          <div style={{ padding: "0.5rem" }}>
            <span>Actions fired: {actions.length} </span>
            {actions.length > 1 ? (
              <button onClick={() => debugActions.clearActions()}>Clear</button>
            ) : null}
            {current < numActions ? (
              <button
                onClick={() => debugActions.moveToState(actions.length - 1)}>
                Resume
              </button>
            ) : null}
          </div>
          <ul style={{ listStyleType: "none", margin: 0, padding: 0 }}>
            {actions
              .slice()
              .sort((a, b) => a.endTime - b.endTime)
              .map((action, i) => (
                <li key={action.id} style={{ margin: 0, padding: 0 }}>
                  <Action
                    action={action}
                    state={states[action.id]}
                    selected={i == current}
                    disabled={i > current}
                    onClick={() => debugActions.moveToState(i)}
                  />
                </li>
              ))}
          </ul>
        </div>
      </div>
    );
  }
}
