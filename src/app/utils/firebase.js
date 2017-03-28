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

  /* eslint-disable */
  getUserCourses: (dispatch, TYPE) => {
    let userCur = null;
    const id = firebaseAuth.currentUser ? firebaseAuth.currentUser.uid : null;
    if (!id) return null
    usersRef.child(id.toString()).on('value', function (snap) {

      // Before modifying the course array, check if the user node
      // has been initialized in Firebase, If not, their display name and email
      // must be added to our database
      if (!snap.hasChild('displayname')) {
        let updates = {};
        updates['displayname'] = firebaseAuth.currentUser.displayName;
        usersRef.child(id.toString()).update(updates);
      }
      if (!snap.hasChild('email')) {
        let updates = {};
        updates['email'] = firebaseAuth.currentUser.email;
        usersRef.child(id.toString()).update(updates);
      }


      // Get user's Course Array if it exists
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
    /* eslint-enable */
  },

    deleteCourse: (coursearray, course) => {
        let obj = [];
        const userSections = [];
        const sections = [];
        const id = firebaseAuth.currentUser ? firebaseAuth.currentUser.uid : null;
        let index = -1;
        for (let i = 0; i < coursearray.length; i += 1) {
            if (coursearray[i] === course) {
                index = i;
            }
        }
        if (index > -1) {
            coursearray.splice(index, 1);
        }
       /* eslint-disable */
       course.section ? userSections.push(course.coursenumber + course.section) : null;
       course.tutorialsection ? userSections.push(course.coursenumber + course.tutorialsection) : null;
       course.labsection ? userSections.push(course.coursenumber + course.labsection + '1') : null;

       userSections.map((section) => {
         sections.push(coursesRef.child(section).once('value').then(function (snap) {
        return snap.val();
         }))
       })

    Promise.all(sections).then(function (resolvedSub) {
      resolvedSub.map((sec, i) => {
        let path = userSections[i];
        obj = sec.Subscribers;
        delete obj[id];
        coursesRef.child(path).child('Subscribers').set(obj);
      });
    });
    /* eslint-enable */
        usersRef.child(id.toString()).child('coursearray').set(coursearray);
        return null;
    },


    addUserSection: (courseArray, courseNumber, section) => {
        // Variable to keep track of course index
        let courseIndex = -1;
        let path = '';
        // current user's UID
        const id = firebaseAuth.currentUser ? firebaseAuth.currentUser.uid : null;

        // Check if the user has already subscribed to one section of the course
        for (let i = 0; i < courseArray.length; i += 1) {
        // If the course is already in the course array, then overwrite the section
            if (courseArray[i].coursenumber === courseNumber) {
                courseIndex = i; // contains index number of course in user's courseArray
            }
        }

        if (courseIndex >= 0) {
            if (section.component === 'LAB' && courseArray[courseIndex].labsection) {
                path = courseArray[courseIndex].coursenumber + courseArray[courseIndex].labsection + 1;
            }
            if (section.component === 'TUT' && courseArray[courseIndex].tutorialsection) {
                path = courseArray[courseIndex].coursenumber + courseArray[courseIndex].tutorialsection;
            }
            if (section.component === 'LEC' && courseArray[courseIndex].section) {
                path = courseArray[courseIndex].coursenumber + courseArray[courseIndex].section;
            }
            if (path) {
                coursesRef.child(path).child('Subscribers').child(id).set(null);
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

        // Adding the user to the subscriber list of the course
        const updateSubs = {};
        /* eslint-disable */
        updateSubs['/Subscribers/' + id.toString()] = firebaseAuth.currentUser.displayName;

        const courseSectionPath = section.component === 'LAB' ? courseNumber + section.section + 1 : courseNumber + section.section;
        /* eslint-enable */
        coursesRef.child(courseSectionPath).update(updateSubs);

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
     }
      /* eslint-enable */

        // Building path to course section so that it can be read/written to
        const sectionPath = courseNumber + section.section;

        // The timetable variable that will contain all the Date objects of each individual class
        const timetablePromises = [];

        // Loop through every pat value of a given course section (usually only greater than 1 for labs)
        for (let i = 1; i <= section.maxPat; i += 1) {
          /* eslint-disable */
          // new section path has PatNumber appended if it is a lab sections
          const newSectionPath = section.component === 'LAB' ? sectionPath + i + '/' : sectionPath;
          /* eslint-enable */

          // We add a promise to the array for every path we're
          // fetching data from (will be more than one if it's a lab section)
            timetablePromises.push(FireBaseTools.getTimetable(newSectionPath));
        }

    // The .then() function is ONLY triggered if and when ALL of the promises in the given array are resolved.
    // The resolved objects (collection of class date objects)
    // contained inside each promise are merged into a single timetable
    // If any of the objects didn't resolve, then it probably means that the section already contained a timetable
    // in that case, we don't need to do anything, otherwise we update firebase with the newly created timetable
    /* eslint-disable */
    Promise.all(timetablePromises).then(function (promArray) {

      // For each promise, list of dateObjects to the timetable object
      let timetable = {};
      promArray.map(function (dateObject) { timetable = Object.assign(timetable, dateObject); });

      // push the timetable to the appropriate Firebase path
      FireBaseTools.addTimetableToFirebase(timetable, courseSectionPath);
    });
    return null;
    /* eslint-enable */
    },

    addTimetableToFirebase: (timetable, courseSectionPath) => {
    /* eslint-disable */
    // pushes a newly created timetable the appropriate course section path, assuming it doesn't already have one
      coursesRef.child(courseSectionPath).once('value').then(function (snap) {
        // Check if course section already contains timetable. if it does then don't push to firebase
        if (!snap.hasChild('Timetable')) {
          // If it doesn't already have a timetable then add the new timetable
          const updateTimetable = {};
          updateTimetable['Timetable'] = timetable;
          coursesRef.child(courseSectionPath).update(updateTimetable);
      }
      // If this course section already contained a timetable, then there is no need to create a new one
      // do nothing
    }).catch(error => ({
      errorCode: error.code,
      errorMessage: error.message,
    }));
    /* eslint-enable */
    },

    getTimetable: (sectionPath) => {
      // create empty timeTable object
        const timetable = {};
        /* eslint-disable */
        return coursesRef.child(sectionPath).once('value').then(function (snap) {

          // Get start and end dates of the semester
          let startDate = new Date(snap.child('Start Date').val());
          const endDate = new Date(snap.child('End Date').val());

          // Get the array of dates on which courses shouldn't be added (ex: march break and holidays)
          // Remember date objects count months from 0 - 11, so Jan = 0, Feb = 1, etc.
          const noClassThisDay = [];

          // Winter Semester Reading Week
          // Monday, February 20 to Sunday February 26
          noClassThisDay.push(new Date(2017, 1, 20));
          noClassThisDay.push(new Date(2017, 1, 21));
          noClassThisDay.push(new Date(2017, 1, 22));
          noClassThisDay.push(new Date(2017, 1, 23));
          noClassThisDay.push(new Date(2017, 1, 24));
          noClassThisDay.push(new Date(2017, 1, 25));
          noClassThisDay.push(new Date(2017, 1, 26));

          // Easter Weekend and end of semester
          // Friday, April 14 to Sunday April 17
          noClassThisDay.push(new Date(2017, 3, 14));
          noClassThisDay.push(new Date(2017, 3, 15));
          noClassThisDay.push(new Date(2017, 3, 16));
          noClassThisDay.push(new Date(2017, 3, 17));

          // Get the days of the weeks where the course is given
          const givenWeekDay = [snap.val().Sun, snap.val().Mon, snap.val().Tues, snap.val().Wed, snap.val().Thurs, snap.val().Fri, snap.val().Sat];
          // Iterate through every date between day 1 and the last day to see if there's a class
          while (startDate < endDate) {
            // Verify if classes are given on this day or not
            let classesGivenOnThisDay = true;
            for (let i = 0; i < noClassThisDay.length; i += 1) {
              if (noClassThisDay[i].getFullYear() === startDate.getFullYear() && noClassThisDay[i].getMonth() === startDate.getMonth() && noClassThisDay[i].getDate() === startDate.getDate()) {
                // If the current date is included in the list of dates when there are no classes,
                // then don't update the timetable
                classesGivenOnThisDay = false;
            }
          }

        // only update timetable in this iteration if classes are actually given on this date
        if (classesGivenOnThisDay) {
          // Format the month and date so that it is always a two digit number. i.e. Prepend a '0' when 1-digit number
          const monthNumber = startDate.getMonth() < 9 ? '0' + (startDate.getMonth() + 1) : (startDate.getMonth() + 1);
          const dateNumber = startDate.getDate() < 10 ? '0' + (startDate.getDate()) : (startDate.getDate());
          // Create the key for the new DateObject in the form "YEAR-MONTH-DATE"
          const newDateObject = startDate.getFullYear() + '-' + monthNumber + '-' + dateNumber;
          // Add the JSON date key
          switch (startDate.getDay()) {

            case 0: // Sunday
              if (givenWeekDay[0] === 'Y') {
                timetable[newDateObject] = { description: 'No Description' };
              }
              break;

            case 1: // Monday
              if (givenWeekDay[1] === 'Y') {
                timetable[newDateObject] = { description: 'No Description' };
              }
              break;

            case 2: // Tuesday
              if (givenWeekDay[2] === 'Y') {
                timetable[newDateObject] = { description: 'No Description' };
              }
              break;

            case 3: // Wednesday
              if (givenWeekDay[3] === 'Y') {
                timetable[newDateObject] = { description: 'No Description' };
              }
              break;

            case 4: // Thursday
              if (givenWeekDay[4] === 'Y') {
                timetable[newDateObject] = { description: 'No Description' };
              }
              break;

            case 5: // Friday
              if (givenWeekDay[5] === 'Y') {
                timetable[newDateObject] = { description: 'No Description' };
              }
              break;

            case 6: // Saturday
              if (givenWeekDay[6] === 'Y') {
                timetable[newDateObject] = { description: 'No Description' };
              }
              break;

            default:
            //TODO add a proper error check?
          }
        }

        // check next date (startDate acts as our iterator in this loop so it takes the value of the next day)
        const newDate = startDate.setDate(startDate.getDate() + 1);
        startDate = new Date(newDate);
      }
      // return a promise of a timetable object with all the dates of a given course section path
      return timetable;
    }).catch(error => ({
      errorCode: error.code,
      errorMessage: error.message,
    }));
    /* eslint-enable */
    },

    getSections: (courseName) => {
        const sections = [];
        /* eslint-disable */
        return sectionsRef.child(courseName).once('value').then(function (snap) {
        snap.forEach(function (childSnap) {
          sections.push({ section: childSnap.key, maxPat: childSnap.child('MaxPat').val(), component: childSnap.child('Component').val() })
      });
      return sections;
    }).catch(error => ({
        errorCode: error.code,
        errorMessage: error.message,
    }));
    /* eslint-enable */
    },


  getUserEvents: (userCourses) => {
    // let userCourses = null;
    const stringCourses = [];

    const user = firebaseAuth.currentUser ? firebaseAuth.currentUser : null;
    if (!user) {
      return null;
    }
    /* eslint-disable */

      if(userCourses[0]== "No Courses") {return {value: 0}}
        for (var i = 0; i<userCourses.length; i+=1) {
          userCourses[i].section ? stringCourses.push(userCourses[i].coursename + userCourses[i].section ):null
         userCourses[i].tutorialsection ? stringCourses.push(userCourses[i].coursename + userCourses[i].tutorialsection): null
          userCourses[i].labsection ? stringCourses.push(userCourses[i].coursename + (userCourses[i].labsection + "1")):null

        }

      var coursePromises = [];
      stringCourses.map((section) => {
        coursePromises.push(coursesRef.child(section).once('value').then(function (snap) {
          return snap.val();
        }))
      })

      var finalCourses=[], timetable=null, time=[]
      return Promise.all(coursePromises).then(function(resolvedarray){
        resolvedarray.map((course)=>{
          var timetable = course.Timetable? course.Timetable : null, subject=(course.Subject+course.Catalog), section=(" - "+course.Section),
            type=course.Component, popupType=course.Component, monthType=course.Component,  teacher=(course['First Name']+" "+course.Last), room=(course['Room Nbr']), courseTime=(course['Mtg Start']+" - "+course['Mtg End']);

          time=[];
          if(timetable)
          {

            Object.keys(timetable).map(function(key, index) {
              var year = new Date(key).getUTCFullYear(), month = new Date(key).getUTCMonth(), day= new Date(key).getUTCDate() + 1;
              time.push({start :new Date(Date.UTC(year,month,day)), end: new Date(Date.UTC(year,month,day)), title:'', section:'', type:'', popupType:'',  monthType:'', teacher:'', room:'', courseTime:'',
              desc:timetable[key]['description'], datePath:key})
            });
          }

          if (course.Timetable) {
            timetable = time;
            var time = course['Mtg Start']
            var hours = Number(time.match(/^(\d+)/)[1]);
            var minutes = Number(time.match(/:(\d+)/)[1]);
            var AMPM = time.match(/\s(.*)$/)[1];
            if (AMPM === 'PM' && hours < 12) hours = hours + 12;
            if (AMPM === 'AM' && hours == 12) hours = hours - 12;
            var sHours = hours.toString();
            var sMinutes = minutes.toString();

            //end
            var time = course['Mtg End']
            var hours = Number(time.match(/^(\d+)/)[1]);
            var minutes = Number(time.match(/:(\d+)/)[1]);
            var AMPM = time.match(/\s(.*)$/)[1];
            if(AMPM === 'PM' && hours<12) hours = hours+12;
            if(AMPM === 'AM' && hours==12) hours = hours-12;
            var eHours = hours.toString();
            var eMinutes = minutes.toString();

            timetable.map((date)=>{
            date['start'].setHours(sHours);
            date['end'].setHours(eHours);
            date['start'].setMinutes(sMinutes);
            date['end'].setMinutes(eMinutes);
            date['title']= subject;
            date['section']= section;
            // Check if the current user is in the section's Whitelist of user's that can edit the class' description
            // Ensure that you properly format the email string with escape chars since firebase keys don't have '.' characters
            date['canEditDescription'] = course['Whitelist'] ? course['Whitelist'].hasOwnProperty(user.email.replace('.','%2E')) : false;
            // Store the path to the courseSection in each class event
            date['sectionPath'] = course.Component == "Lab" ? course.Subject + course.Catalog + course.Section + 1 : course.Subject + course.Catalog + course.Section ;
            date['type']= type;
            if (date['type'] == "LEC") {
              date['type'] = "Lecture";
            }
            else
              if (date['type'] == "TUT") {
                date['type'] = "Tutorial";
              }
              else {
                (date['type'] == "LAB")
                  date['type'] = "Laboratory";
              }
           date['teacher'] = teacher;
           date['popupType'] = popupType;
            if (date['popupType'] == "LEC") {
              date['popupType'] = "Lecture";
            }
            else
            if (date['popupType'] == "TUT") {
              date['popupType'] = "Tutorial";
            }
            else {
              (date['popupType'] == "LAB")
              date['popupType'] = "Lab";
            }
            date['monthType'] = monthType;
           date['room'] = room;
           if (date['room'] == "") {
            date['room'] = "TBA";
           }
           date['courseTime']=courseTime;

            finalCourses.push(date)
          })
        }
      })
       return finalCourses
      }
      )
  
  },

    setDescription: (sectionPath, datePath, description) => {
        // Change the description of the specific class on Firebase
        const updateDescription = {};
        updateDescription['description'] = description;
        /* eslint-enable */
        coursesRef.child(sectionPath).child('Timetable').child(datePath.toString()).update(updateDescription);
        return null;
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
