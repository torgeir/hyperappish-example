import React from "react";

import { actions } from "../actions";
import { Row, Item } from "./rows";

const Number = Item.extend`
  background-color: orange;
  color: white;
  text-align: center;
`;

const Button = Item.extend`
  background-color: green;
  color: white;
  &:focus,
  &:hover {
    background-color: #2a2;
  }
  &:active {
    background-color: #2f2;
  }
`;

export const Incrementer = ({ n }) => (
  <div>
    <Row>
      <Number>{n}</Number>
    </Row>
    <Row>
      <Button onClick={() => actions.incrementer.increment(1)}>+</Button>
      <Button onClick={() => actions.incrementer.decrement(1)}>-</Button>
    </Row>
    <Row>
      <Button onClick={() => actions.incrementer.start()}>start</Button>
      <Button onClick={() => actions.incrementer.stop()}>stop</Button>
    </Row>
  </div>
);
