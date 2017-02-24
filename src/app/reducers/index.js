import { combineReducers } from 'redux';
import FireBaseUserReducer from './firebase_user_reducer';
import UserCourses from './getUserCourses';
import Sections from './getSections';
import SectionUpdatePromise from './addUserSection';

const rootReducer = combineReducers({
    currentUser: FireBaseUserReducer,
    userCourses: UserCourses,
    sections: Sections,
    sectionUpdatePromise: SectionUpdatePromise,
});

export default rootReducer;
