import React from "react";
import UniversalRouter from "universal-router";

import { ensureUsers, Users } from "./components/users";
import { Incrementer } from "./components/incrementer";

export default new UniversalRouter([
  {
    path: "/",
    action: () => ({ redirect: "/users" })
  },
  {
    path: "/users",
    children: [
      {
        path: "",
        action: () => ensureUsers(({ users }) => <Users {...users} />)
      },
      {
        path: "/:uid",
        action: ({ params: { uid } }) =>
          ensureUsers(({ users }) => (
            <Users
              {...users}
              selected={users.list.find(({ id }) => id == uid)}
            />
          ))
      }
    ]
  },
  {
    path: "/incrementer",
    action: () => ({ incrementer }) => <Incrementer {...incrementer} />
  }
]);
