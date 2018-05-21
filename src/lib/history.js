import createBrowserHistory from "history/createBrowserHistory";

const history = createBrowserHistory();

export const { push, replace, location, listen } = history;
