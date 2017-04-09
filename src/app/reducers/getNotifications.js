import {
  GET_NOTIFICATIONS,
} from '../actions/types';

export default function (state = null, action) {
    switch (action.type) {
    case GET_NOTIFICATIONS:
        return action.payload;
    default:
        return state;
    }
}
