import { createStore } from 'redux';

import reducers from "./reducers";

const initialState = {
    auth: {}
}

export const store = createStore(initialState, reducers);
