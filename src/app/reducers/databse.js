import {
  GET_USER_COURSES,
} from '../actions/types';

const initialState= {
    loaded:false,
    courses:null
}


export default function (state = initialState, action) {
    switch (action.type) {
    case GET_USER_COURSES:
        var newState= {loaded:true, courses: action.payload}
        return newState;
    default:
        return state;
    }
}