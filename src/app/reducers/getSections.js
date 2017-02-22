import {
  GET_SECTIONS,
} from '../actions/types';

const initialState = {
    sections: null,
    loaded: false,
};


export default function (state = initialState, action) {
    let newState;
    switch (action.type) {
    case GET_SECTIONS:
        newState = { loaded: true, sections: action.payload };
        return newState;
    default:
        return state;
    }
}
