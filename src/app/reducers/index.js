import { combineReducers } from 'redux';
import FireBaseUserReducer from './firebase_user_reducer';
import UserCourses from './getUserCourses';
import Sections from './getSections';

const rootReducer = combineReducers({
    currentUser: FireBaseUserReducer,
    userCourses: UserCourses,
    sections: Sections,
});

export default rootReducer;
