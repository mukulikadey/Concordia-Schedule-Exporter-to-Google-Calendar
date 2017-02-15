import { combineReducers } from 'redux';
import FireBaseUserReducer from './firebase_user_reducer';
import UserCourses from './databse'

const rootReducer = combineReducers({
    currentUser: FireBaseUserReducer,
    databaseInfo: UserCourses
});

export default rootReducer;
