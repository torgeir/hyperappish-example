import Rx from "rxjs/Rx";

import { rand } from "../lib/math";
import { actions } from "../actions";

export const incrementer = action$ =>
  action$
    .filter(action => action.type == "incrementer.start")
    .switchMap(() =>
      Rx.Observable.interval(100).takeUntil(
        action$.filter(action => action.type == "incrementer.stop")
      )
    )
    .map(() => actions.incrementer.increment(rand(10)));
