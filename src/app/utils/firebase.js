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
        let id = firebaseAuth.currentUser ? firebaseAuth.currentUser.uid : null;
        usersRef.child(id.toString()).on('value', function func (snap) {
            if (snap.val()) {
                userCur = (snap.val().coursearray); 
            }
            if (id && !userCur) { userCur = ['No Courses']; }

            // By not returning anything and dispatching from here,
            // the action will be dispatched every time the coursearray changes
            dispatch({
                type: TYPE,
                payload: userCur,
            });
        });
    },

    getSections: (courseName) => {
        let sections = [];
        return sectionsRef.child(courseName).once('value').then(function func (snap) {
          snap.forEach(function func2 (childSnap) {
            sections.push(childSnap.key);
        });
          return sections;
      }).catch(error => ({
          errorCode: error.code,
          errorMessage: error.message,
      }));
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
