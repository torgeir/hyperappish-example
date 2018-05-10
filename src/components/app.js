import React from "react";

import { timetravel } from "../actions";

import { Users, User, SelectedUser } from "./users";
import { Incrementer } from "./incrementer";

export const App = ({ selection, users, incrementer }) => (
  <div>
    <timetravel.ActionList />
    {selection.user && <SelectedUser user={selection.user} />}
    <Users {...users} />
    <Incrementer {...incrementer} />
  </div>
);
