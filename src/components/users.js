import React from "react";

import { actions } from "../actions";

export const User = ({ user, onClick = v => v }) => (
  <span onClick={onClick} style={{ cursor: "pointer" }}>
    {user.name} ({user.id})
  </span>
);

export const Users = ({ list, fetching }) => {
  if (!list.length && !fetching) {
    actions.users.list();
    return <span>Loading..</span>;
  }

  return (
    <div>
      <h2>Users</h2>
      {list.map(user => (
        <div key={user.id}>
          <User user={user} onClick={() => actions.selection.select(user)} />
        </div>
      ))}
    </div>
  );
};

export const SelectedUser = ({ user }) => (
  <div>
    <h2>Selected user</h2>
    <span>
      {user.name} <button onClick={() => actions.selection.remove()}>x</button>
    </span>
  </div>
);
