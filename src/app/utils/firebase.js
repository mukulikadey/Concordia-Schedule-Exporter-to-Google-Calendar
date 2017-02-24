import firebase from 'firebase';
import { FIREBASE_CONFIG } from '../config';

export const firebaseApp = firebase.initializeApp(FIREBASE_CONFIG);
export const firebaseAuth = firebaseApp.auth();
export const firebaseDb = firebaseApp.database();
export const usersRef = firebase.database().ref('users/');
export const sectionsRef = firebase.database().ref('sections/');


const FireBaseTools = {

  /**
   * Return an instance of a firebase auth provider based on the provider string.
   *
   * @param provider
   * @returns {firebase.auth.AuthProvider}
   */
    getProvider: (provider) => {
        switch (provider) {

        case 'email':
            return new firebase.auth.EmailAuthProvider();
        case 'google':
            return new firebase.auth.GoogleAuthProvider();
        default:
            throw new Error('Provider is not supported!!!');
        }
    },


    getUserCourses: (dispatch, TYPE) => {
        let userCur = null;
        const id = firebaseAuth.currentUser ? firebaseAuth.currentUser.uid : null;
        /* eslint-disable */
        usersRef.child(id.toString()).on('value', function(snap) {

            // Before modifying the course array, check if the user node
            // has been initialized in Firebase, If not, their display name and email
            // must be added to our database
            if (!snap.hasChild('displayname'))
            {
              let updates = {};
              updates['displayname'] = firebaseAuth.currentUser.displayName;
              usersRef.child(id.toString()).update(updates);
            }
            if (!snap.hasChild('email'))
            {
              let updates = {};
              updates['email'] = firebaseAuth.currentUser.email;
              usersRef.child(id.toString()).update(updates);
            }


            // Get user's Course Array if it exists
            if (snap.val()) {
                userCur = (snap.val().coursearray);
            }
            if (id && !userCur) { userCur = ['No Courses'];}

            // By not returning anything and dispatching from here,
            // the action will be dispatched every time the coursearray changes
            dispatch({
                type: TYPE,
                payload: userCur,
            });
        });
        /* eslint-enable */
    },

    addUserSection: (courseArray, courseNumber, section) => {

      // Variable to keep track of course index
      let courseIndex = -1;
      // current user's UID
      const id = firebaseAuth.currentUser ? firebaseAuth.currentUser.uid : null;

      // Check if the user has already subscribed to one section of the course
      for(let i = 0; i < courseArray.length ; i++)
      {
        // If the course is already in the course array, then overwrite the section
        if(courseArray[i].coursenumber == courseNumber)
          courseIndex = i; // contains index number of course in user's courseArray
      }

      if(courseIndex < 0)
      {
        // A new course is added to the courseArray if the student was not previously subscribed to it
        let newCourse =
          {
            coursename: courseNumber,
            coursenumber: courseNumber
          };

        // Set course index to the next available index value or to 0 if courseArray doesn't exist yet
        courseIndex = courseArray ? courseArray.length : 0;

        // Create new firebase path with the course details
        let updates = {};
        updates[courseIndex] = newCourse;
        usersRef.child(id.toString()).child('coursearray').update(updates);
      }

      let updates = {};

      //Update appropriate section depending on whether it's a lab,tutorial or lecture
      if(section.component == 'LEC'){
        updates['/' + courseIndex + '/section'] = section.section;
        usersRef.child(id.toString()).child('coursearray').update(updates);
      }
      else if(section.component == 'TUT'){
        updates['/' + courseIndex + '/tutorialsection'] = section.section;
        usersRef.child(id.toString()).child('coursearray').update(updates);
      }
      else if(section.component == 'LAB'){
        updates['/' + courseIndex + '/labsection'] = section.section;
        usersRef.child(id.toString()).child('coursearray').update(updates);
      }
      else
        console.log("an error occurred, this section has no component");


      return null;

      // TODO update the error message
      // TODO Subscribe user to course
      // TODO if course has been added for the first time, then create a timetable
      // TODO If it's the user's first course, then they might not even have a course array
      // so we would need to initialize that as well
      // TODO add more error checking

    },


    getSections: (courseName) => {
        const sections = [];
        /* eslint-disable */
        return sectionsRef.child(courseName).once('value').then(function(snap) {
            snap.forEach(function(childSnap) {
              sections.push({section:childSnap.key, maxPat:childSnap.child('MaxPat').val(), component:childSnap.child('Component').val()})
          });
            return sections;
        }).catch(error => ({
          errorCode: error.code,
          errorMessage: error.message,
      }));
      /* eslint-enable */
    },

  /**
   * Login with provider => p is provider "email", "facebook", "github", "google", or "twitter"
   * Uses Popup therefore provider must be an OAuth provider. EmailAuthProvider will throw an error
   *
   * @returns {any|!firebase.Thenable.<*>|firebase.Thenable<any>}
   */
    loginWithProvider: (p) => {
        const provider = FireBaseTools.getProvider(p);
        return firebaseAuth.signInWithPopup(provider).then(firebaseAuth.currentUser).catch(error => ({
            errorCode: error.code,
            errorMessage: error.message,
        }));
    },

  /**
   * Register a user with email and password
   *
   * @param user
   * @returns {any|!firebase.Thenable.<*>|firebase.Thenable<any>}
   */
    registerUser: user => firebaseAuth.createUserWithEmailAndPassword(user.email, user.password)
        .then(userInfo => userInfo)
        .catch(error => ({
            errorCode: error.code,
            errorMessage: error.message,
        })),

  /**
   * Sign the user out
   *
   * @returns {!firebase.Promise.<*>|firebase.Thenable<any>|firebase.Promise<any>|!firebase.Thenable.<*>}
   */
    logoutUser: () => firebaseAuth.signOut().then(() => ({
        success: 1,
        message: 'logout',
    })),

  /**
   * Retrieve the current user (Promise)
   * @returns {Promise}
   */
    fetchUser: () => new Promise((resolve, reject) => {
        const unsub = firebaseAuth.onAuthStateChanged((user) => {
            unsub();
            resolve(user);
        }, (error) => {
            reject(error);
        });
    }),

  /**
   * Log the user in using email and password
   *
   * @param user
   * @returns {any|!firebase.Thenable.<*>|firebase.Thenable<any>}
   */
    loginUser: user => firebaseAuth.signInWithEmailAndPassword(user.email, user.password)
        .then(userInfo => userInfo)
        .catch(error => ({
            errorCode: error.code,
            errorMessage: error.message,
        })),

  /**
   * Update a user's profile data
   *
   * @param u
   * @returns {!firebase.Promise.<*>|firebase.Thenable<any>|firebase.Promise<any>|!firebase.Thenable.<*>}
   */
    updateUserProfile: u => firebaseAuth.currentUser.updateProfile(u).then(() => firebaseAuth.currentUser, error => ({
        errorCode: error.code,
        errorMessage: error.message,
    })),

  /**
   * Reset the password given the specified email
   *
   * @param email {string}
   * @returns {!firebase.Promise.<*>|firebase.Thenable<any>|firebase.Promise<any>|!firebase.Thenable.<*>}
   */
    resetPasswordEmail: email => firebaseAuth.sendPasswordResetEmail(email).then(() => ({
        message: 'Email sent',
    }), error => ({
        errorCode: error.code,
        errorMessage: error.message,
    })),

  /**
   * Update the user's password with the given password
   *
   * @param newPassword {string}
   * @returns {!firebase.Promise.<*>|firebase.Thenable<any>|firebase.Promise<any>|!firebase.Thenable.<*>}
   */
    changePassword: newPassword => firebaseAuth.currentUser.updatePassword(newPassword).then(user => user, error => ({
        errorCode: error.code,
        errorMessage: error.message,
    })),

  /**
   * Send an account email verification message for the currently logged in user
   *
   * @returns {!firebase.Promise.<*>|firebase.Thenable<any>|firebase.Promise<any>|!firebase.Thenable.<*>}
   */
    sendEmailVerification: () => firebaseAuth.currentUser.sendEmailVerification().then(() => ({
        message: 'Email sent',
    }), error => ({
        errorCode: error.code,
        errorMessage: error.message,
    })),

  /**
   * Get the firebase database reference.
   *
   * @param path {!string|string}
   * @returns {!firebase.database.Reference|firebase.database.Reference}
   */
    getDatabaseReference: path => firebaseDb.ref(path),
};

export default FireBaseTools;
