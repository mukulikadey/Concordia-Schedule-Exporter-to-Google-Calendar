import {
  SET_DESCRIPTION,
} from '../actions/types';

export default function (state = null, action) {
    switch (action.type) {
case SET_DESCRIPTION:
      return action.payload;
default:
      return state;
  }
}
