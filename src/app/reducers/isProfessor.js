import {
  IS_PROFESSOR,
} from '../actions/types';

export default function (state = null, action) {
  switch (action.type) {
    case IS_PROFESSOR:
      return action.payload ;
    default:
      return state;
  }
}
