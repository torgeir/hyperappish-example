import { location } from "./lib/history";
import { decode } from "./lib/url";

export const state = {
  location: {
    path: location.pathname,
    query: decode(location.search)
  },
  incrementer: {
    incrementing: false,
    n: 0
  },
  users: {
    list: [],
    fetching: false,
    error: null
  }
};
