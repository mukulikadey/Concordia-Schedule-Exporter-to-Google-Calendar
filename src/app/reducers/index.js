import { combineReducers } from 'redux';
import FireBaseUserReducer from './firebase_user_reducer';
import UserCourses from './getUserCourses';
import Sections from './getSections';
import SectionUpdatePromise from './addUserSection';
import UserEvents from './getEvents';

const rootReducer = combineReducers({
    currentUser: FireBaseUserReducer,
    userCourses: UserCourses,
    sections: Sections,
    sectionUpdatePromise: SectionUpdatePromise,
    userEvents: UserEvents,
});

export default rootReducer;
