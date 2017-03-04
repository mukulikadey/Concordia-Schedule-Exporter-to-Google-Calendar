import {
  ADD_USER_SECTION,
} from '../actions/types';

export default function (state = null, action) {
    switch (action.type) {
  case ADD_USER_SECTION:
      return action.payload;
  default:
      return state;
  }
}
