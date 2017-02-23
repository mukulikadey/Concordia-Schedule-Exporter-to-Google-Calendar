import {
  GET_SECTIONS,
} from '../actions/types';

export default function (state = null, action) {
    let newState;
    switch (action.type) {
    case GET_SECTIONS:
        return action.payload;
    default:
        return state;
    }
}
