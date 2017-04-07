import { combineReducers } from 'redux';
import FireBaseUserReducer from './firebase_user_reducer';
import UserCourses from './getUserCourses';
import Sections from './getSections';
import SectionUpdatePromise from './addUserSection';
import UserEvents from './getEvents';
import SetDescription from './setDescription';
import ProfState from './isProfessor';


const rootReducer = combineReducers({
    currentUser: FireBaseUserReducer,
    userCourses: UserCourses,
    sections: Sections,
    sectionUpdatePromise: SectionUpdatePromise,
    userEvents: UserEvents,
    setDescription: SetDescription,
    profState: ProfState,
});

export default rootReducer;
