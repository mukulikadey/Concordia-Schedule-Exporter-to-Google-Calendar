import {
  GET_EVENTS,
} from '../actions/types';

export default function (state = null, action) {
    switch (action.type) {
    case GET_EVENTS:
        if (!action.payload) { return null; }
        return action.payload;
    default:
        return state;
    }
}
