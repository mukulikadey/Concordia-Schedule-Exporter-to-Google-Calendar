import firebase from 'firebase';
import { FIREBASE_CONFIG } from '../config';

export const firebaseApp = firebase.initializeApp(FIREBASE_CONFIG);
export const firebaseAuth = firebaseApp.auth();
export const firebaseDb = firebaseApp.database();
export const usersRef = firebase.database().ref('users/');
export const sectionsRef = firebase.database().ref('sections/');
export const coursesRef = firebase.database().ref('course/');

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

  getTimetable :  (tempTimetable, sectionPath) => {
    // Get the course node and add Timetable if it doesn't already exist
    /* eslint-disable */
    // timetable is equal to the inputted timeTable so that it can be updated
    var timetable = tempTimetable;
    coursesRef.child(sectionPath).once('value').then(function(snap){

      // Check if course section already contains timetable
      if (!snap.hasChild('timetable')) {
        // Create Timetable if this course did not already contain one
        // Get start and end dates of the semester
        let startDate = new Date(snap.child('Start Date').val());
        const endDate = new Date(snap.child('End Date').val());

        console.log(sectionPath); //TODO REMOVE
        console.log(snap.val()); //TODO REMOVE

        // Get the days of the weeks where the course is given
        const givenWeekDay = [snap.val().Sun, snap.val().Mon, snap.val().Tues, snap.val().Wed, snap.val().Thurs, snap.val().Fri, snap.val().Sat];
        // Iterate through every date between day 1 and the last day to see if there's a class
        while (startDate < endDate) {
          // Format the month so that it is always a two digit number
          const monthNumber = startDate.getMonth() < 8 ? '0' + (startDate.getMonth() + 1) : (startDate.getMonth() + 1);
          // Create the key for the new DateObject in the form "YEAR-MONTH-DATE"
          const newDateObject = startDate.getFullYear() + '-' + monthNumber + '-' + startDate.getDate();
          // Add the JSON date key
          switch (startDate.getDay()) {

            case 0: // Sunday
              if(givenWeekDay[0] === 'Y') {
                timetable[newDateObject] = { description : 'No Description' };
              }
              break;

            case 1: // Monday
              if(givenWeekDay[1] === 'Y') {
                timetable[newDateObject] = { description : 'No Description' };
              }
              break;

            case 2: // Tuesday
              if(givenWeekDay[2] === 'Y') {
                timetable[newDateObject] = { description : 'No Description' };
              }
              break;

            case 3: // Wednesday
              if(givenWeekDay[3] === 'Y') {
                timetable[newDateObject] = { description : 'No Description' };
              }
              break;

            case 4: // Thursday
              if(givenWeekDay[4] === 'Y') {
                timetable[newDateObject] = { description : 'No Description' };
              }
              break;

            case 5: // Friday
              if(givenWeekDay[5] === 'Y') {
                timetable[newDateObject] = { description : 'No Description' };
              }
              break;

            case 6: // Saturday
              if(givenWeekDay[6] === 'Y') {
                timetable[newDateObject] = { description : 'No Description' };
              }
              break;

            default:
              console.log('There was an error in retrieving the day of the week');
            //TODO add a proper error check?
          }

          // check next date
          let newDate = startDate.setDate(startDate.getDate() + 1);
          startDate = new Date(newDate);
        }
      }else{ return null;}
    }).catch(error => ({
      errorCode: error.code,
      errorMessage: error.message,
    }));
    // return updated timetable
    console.log('timetable' + timetable);
    return timetable;
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
    for (let i = 0; i < courseArray.length; i += 1) {
      // If the course is already in the course array, then overwrite the section
      if (courseArray[i].coursenumber === courseNumber) {
        courseIndex = i; // contains index number of course in user's courseArray
      }
    }

    if (courseIndex < 0) {
      // A new course is added to the courseArray if the student was not previously subscribed to it
      const newCourse =
        {
          coursename: courseNumber,
          coursenumber: courseNumber,
        };

      // Set course index to the next available index value or to 0 if courseArray doesn't exist yet
      courseIndex = courseArray ? courseArray.length : 0;

      // Create new firebase path with the course details
      const updates = {};
      updates[courseIndex] = newCourse;
      usersRef.child(id.toString()).child('coursearray').update(updates);
    }

    const updates = {};

    // Update appropriate section depending on whether it's a lab,tutorial or lecture
    /* eslint-disable */
    if (section.component === 'LEC') {
      updates['/' + courseIndex + '/section'] = section.section;
      usersRef.child(id.toString()).child('coursearray').update(updates);
    }
    else if (section.component === 'TUT') {
      updates['/' + courseIndex + '/tutorialsection'] = section.section;
      usersRef.child(id.toString()).child('coursearray').update(updates);
    }
    else if (section.component === 'LAB') {
      updates['/' + courseIndex + '/labsection'] = section.section;
      usersRef.child(id.toString()).child('coursearray').update(updates);
    }
    else {
      console.log('an error occurred, this section has no component');
    }
    /* eslint-enable */

    // Building path to course section so that it can be read/written to
    let sectionPath = courseNumber + section.section;

    // The timetable variable that will contain all the Date objects of each individual class
    let timetable = {};

    // Loop through every pat value of a given course section (usually only greater than 1 for labs)
    for(let i = 1; i <= section.maxPat; i++){

      // new section path has PatNumber appended if it is a lab sections
      let newSectionPath = section.component == 'LAB' ? sectionPath + i + '/' : sectionPath;
      console.log(newSectionPath);

      // timetable is updated with new data every time the getTimetable function is called
      let tempTimetable = timetable;
      timetable = FireBaseTools.getTimetable(tempTimetable,newSectionPath);
    }
    console.log(timetable);
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
