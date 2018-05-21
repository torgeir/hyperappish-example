import React from "react";
import styled from "styled-components";

import { actions, timetravel } from "../actions";

import { Row, Item } from "./rows";

const Layout = styled.div`
  width: 100%;
  height: 100%;
`;

export const App = ({ children }) => (
  <Layout>
    <timetravel.View>
      <Row>
        <Item onClick={() => actions.location.go("/users", {})}>Users</Item>
        <Item onClick={() => actions.location.go("/incrementer", {})}>
          Incrementer
        </Item>
      </Row>
      {children}
    </timetravel.View>
  </Layout>
);
