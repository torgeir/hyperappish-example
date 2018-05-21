import React from "react";

import { actions } from "../actions";
import { Row, Item } from "./rows";

const Link = Item.withComponent("a");

const User = Link.extend`
  cursor: pointer;
  text-align: left;
  &:hover {
    background-color: #fb0;
    color: white;
  }
`;

const SelectedUser = User.extend`
  background-color: orange;
  color: white;
`;

const Message = Item.extend`
  text-align: left;
`;

const Error = Message.extend`
  background-color: red;
  color: white;
`;

export const ensureUsers = fn => ({ users }) => {
  if (users.error) {
    return <Users.Error />;
  }
  if (users.fetching) {
    return <Users.Loading />;
  }
  if (users.list.length == 0 && !users.fetching) {
    actions.users.list();
    return <Users.Loading />;
  }
  return fn({ users });
};

export const Users = ({ list, error, selected }) => {
  if (error) {
    return <Users.Error />;
  }

  return list.map(user => (
    <Row key={user.id}>
      {user == selected ? (
        <SelectedUser onClick={() => actions.location.clearUser()}>
          {user.name}{" "}
        </SelectedUser>
      ) : (
        <User onClick={() => actions.location.selectUser(user)}>
          {user.name}
        </User>
      )}
    </Row>
  ));
};

Users.Loading = () => (
  <Row>
    <Message>Loading..</Message>
  </Row>
);

Users.Error = () => (
  <Row>
    <Error>An error occurred.</Error>
  </Row>
);
