import React from "react";

import { rand } from "../lib/math";
import { actions } from "../actions";

export const Incrementer = ({ n }) => (
  <div>
    <h2>Incrementer</h2>
    Incrementing: {n}
    <button onClick={() => actions.incrementer.increment(1)}>inc</button>
    <button onClick={() => actions.incrementer.start()}>start</button>
    <button onClick={() => actions.incrementer.stop()}>stop</button>
  </div>
);
