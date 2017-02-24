import {
  GET_SECTIONS,
} from '../actions/types';

export default function (state = null, action) {
    switch (action.type) {
    case GET_SECTIONS:
        return action.payload;
    default:
        return state;
    }
}
