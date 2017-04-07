import FireBaseTools from '../utils/firebase';
import {
  LOGIN_WITH_PROVIDER_FIREBASE,
  REGISTER_FIREBASE_USER,
  LOGIN_FIREBASE_USER,
  FETCH_FIREBASE_USER,
  UPDATE_FIREBASE_USER,
  CHANGE_FIREBASE_USER_PASSWORD,
  FIREBASE_PASSWORD_RESET_EMAIL,
  LOGOUT_FIREBASE_USER,
  GET_USER_COURSES,
  GET_SECTIONS,
  ADD_USER_SECTION,
  GET_EVENTS,
  SET_DESCRIPTION,
  DELETE_COURSE,
  IS_PROFESSOR,
} from './types';


export function loginWithProvider(provider) {
    const request = FireBaseTools.loginWithProvider(provider);
    return {
        type: LOGIN_WITH_PROVIDER_FIREBASE,
        payload: request,
    };
}

export function getEvents(usercourses) {
    const request = FireBaseTools.getUserEvents(usercourses);

    return {
        type: GET_EVENTS,
        payload: request,
    };
}

export function setDescription(event, description) {
    const request = FireBaseTools.setDescription(event, description);
    return {
        type: SET_DESCRIPTION,
        payload: request,
    };
}

// Using the redux-thunk library, we can dispatch functions
// instead of returning a static value once, we dispatch every time
// a change event is called by Firebase's .on() function
export function deleteCourse(coursearray, course) {
    const request = FireBaseTools.deleteCourse(coursearray, course);

    return {
        type: DELETE_COURSE,
        payload: request,
    };
}

export function getUserCourses() {
    return (dispatch) => {
        FireBaseTools.getUserCourses(dispatch, GET_USER_COURSES);
    };
}

export function isProfessor() {
  return (dispatch) => {
    FireBaseTools.isProfessor(dispatch, IS_PROFESSOR);
  };
}


export function addUserSection(courseArray, courseNumber, section) {
    const request = FireBaseTools.addUserSection(courseArray, courseNumber, section);
    return {
        type: ADD_USER_SECTION,
        payload: request,
    };
}

export function getSections(courseName) {
    const request = FireBaseTools.getSections(courseName);
    return {
        type: GET_SECTIONS,
        payload: request,
    };
}

export function registerUser(user) {
    const request = FireBaseTools.registerUser(user);
    return {
        type: REGISTER_FIREBASE_USER,
        payload: request,
    };
}

export function loginUser(user) {
    const request = FireBaseTools.loginUser(user);
    return {
        type: LOGIN_FIREBASE_USER,
        payload: request,
    };
}

export function fetchUser() {
    const request = FireBaseTools.fetchUser();
    return {
        type: FETCH_FIREBASE_USER,
        payload: request,
    };
}

export function updateUser(user) {
    const request = FireBaseTools.updateUserProfile(user);
    return {
        type: UPDATE_FIREBASE_USER,
        payload: request,
    };
}

export function changePassword(newPassword) {
    const request = FireBaseTools.changePassword(newPassword);
    return {
        type: CHANGE_FIREBASE_USER_PASSWORD,
        payload: request,
    };
}

export function resetPasswordEmail(email) {
    const request = FireBaseTools.resetPasswordEmail(email);
    return {
        type: FIREBASE_PASSWORD_RESET_EMAIL,
        payload: request,
    };
}

export function logoutUser(user) {
    const request = FireBaseTools.logoutUser(user);
    return {
        type: LOGOUT_FIREBASE_USER,
        payload: request,
    };
}
