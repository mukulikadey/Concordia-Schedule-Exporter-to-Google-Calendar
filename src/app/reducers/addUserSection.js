import {
  ADD_USER_SECTION,
  DELETE_COURSE,
  ADD_TA
} from '../actions/types';

export default function (state = null, action) {
    switch (action.type) {
    case ADD_USER_SECTION:
        return action.payload;
    case DELETE_COURSE:
        return action.payload;
    case ADD_TA:
        return action.payload;
    default:
        return state;
    }
}
