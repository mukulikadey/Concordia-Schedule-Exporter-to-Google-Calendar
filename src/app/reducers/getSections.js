import {
  GET_SECTIONS,
} from '../actions/types';

const initialState= {
    sections:null,
    loaded:false
}


export default function (state = initialState, action) {
    switch (action.type) {
      case GET_SECTIONS:
        var newState= {loaded:true, sections: action.payload}
        return newState;
    default:
        return state;
    }
}
