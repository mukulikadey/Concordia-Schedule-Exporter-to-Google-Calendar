import {
  GET_USER_COURSES,
  GET_SECTIONS,
} from '../actions/types';

const initialState= {
    loaded:false,
    courses:null,
    sections:null
}


export default function (state = initialState, action) {
    switch (action.type) {
    case GET_USER_COURSES:
        var newState= {loaded:true, courses: action.payload}
        return newState;
      case GET_SECTIONS:
        var newState= {loaded:true, sections: action.payload}
        return newState;
    default:
        return state;
    }
}
