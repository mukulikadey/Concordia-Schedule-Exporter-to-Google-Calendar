import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import firebase from '../../utils/firebase';
import BigCalendar from 'react-big-calendar';
import  '../user/react-big-calendar.css';
import moment from 'moment';
import localizer from 'react-big-calendar/lib/localizers/moment';
import { fetchUser, updateUser,getEvents, setDescription } from '../../actions/firebase_actions';
import Loading from '../helpers/loading';
import ChangePassword from './change_password';
import 'sweetalert';
import '../user/sweetalert.css';

BigCalendar.momentLocalizer(moment);
localizer(moment);


class ScheduleGen extends Component {

  constructor(props) {
    super(props);
    this.props.fetchUser();
    this.props.getEvents(this.props.userCourses.courses);
    this.state = {
      events: this.props.userEvents,
      message: '',
      signedStatus: "Signed Out"

    };
    this.onFormSubmit = this.onFormSubmit.bind(this);
    this.exportEvents = this.exportEvents.bind(this);
    this.updateSignInStatus = this.updateSignInStatus.bind(this);
    this.googleSignIn = this.googleSignIn.bind(this);
  }

  componentWillMount(){
    //Handling initial stage
    let gapi = getGapi();
    this.updateSignInStatus(gapi.auth2.getAuthInstance().isSignedIn.get());
  }

  componentDidMount(){
    this.props.getEvents(this.props.userCourses.courses);

  }

  onFormSubmit(event) {
    event.preventDefault();
    const email = this.refs.email.value;
    const displayName = this.refs.displayName.value;
    this.props.updateUser({email, displayName}).then((data) => {
        if (data.payload.errorCode) {
          this.setState({message: data.payload.errorMessage});
        } else {
          this.setState({
            message: 'Updated successfuly!',
          });
        }
      }
    );
  }

  eventStyleGetter(event,title) {
    var stringToColour = function(str) {
      var hash = 0;
      for (var i = 0; i < str.length; i++) {
        hash = str.charCodeAt(i) + ((hash << 5) - hash);
      }
      var colour = '#';
      for (var i = 0; i < 3; i++) {
        var value = (hash >> (i * 18)) & 0xFF;
        colour += ('00' + value.toString(16)).substr(-1);
      }
      return colour;
    }

    var backgroundColor = '#' + event.hexColor;
    var style = {
      backgroundColor: stringToColour(event.title),
      borderRadius: '0px',
      color: 'black',
      border: '0px',
      display: 'block',
      width: '100px'
    };

    return {
      style: style
    };

  }
  titleSect({event}) {
    return (
      <span>
      <div>
      { event.section && (event.title + event.section)}
      </div>
        { event.type && (  event.type  )}
    </span>
    )
  }

  titleSectMonth({event}) {
    return (
      <span>
      { event.section && (event.title + " (" + event.monthType + ")")}
      </span>
    )
  }

  googleSignIn(){
    if(this.state.signedStatus == "Signed Out"){
      let gapi = getGapi();
      gapi.auth2.getAuthInstance().signIn().then(this.exportEvents);
    }
    else{
      this.exportEvents();
    }
  }

  exportEvents(){
      let batch = gapi.client.newBatch(); //For batch requests
      let events = this.props.userEvents; //Get course events of the user
      //Checking if a CUSE calendar exists. If it does, remove it. Then, create a new calendar from scratch
      let listRequest = gapi.client.calendar.calendarList.list();
      listRequest.execute(function(resp){
        var calendars = resp.items;
        for(let i = 0; i < calendars.length; i++){
          if(calendars[i].summary == "CUSE"){
            //Execute remove request for CUSE calendar
            gapi.client.calendar.calendars.delete({
              'calendarId' : calendars[i].id
            }).execute();
          }
        }
      });

      //Insert new secondary calendar and get its id
      gapi.client.calendar.calendars.insert({
        'summary' : "CUSE"
      }).execute(function(resp) {
        let calendarId = resp.id;

        for(let i = 0; i < events.length; i++){
          //Create a course event for every entry in userEvents
          let event = {
            'summary' : events[i].title,
            'start' : {
              'dateTime': events[i].start.toISOString(),
              'timeZone': 'America/Montreal'
            },
            'end' : {
              'dateTime' : events[i].end.toISOString(),
              'timeZone' : 'America/Montreal'
            }
          }
          //Creating a request to insert the event
          let insertRequest = gapi.client.calendar.events.insert({
            'calendarId' : calendarId,
            'resource' : event
          })
          //Adding previous request to batch to send all at once
          batch.add(insertRequest);
        }
        //Sending the batch request
        batch.execute();

      });
  }

  updateSignInStatus() {
    let gapi = getGapi();
    if(gapi.auth2.getAuthInstance().isSignedIn.get()){
      this.setState({signedStatus: "Signed In"});
    }
    else{
      this.setState({signedStatus: "Signed Out"});
    }
  }

  renderGoogle(){
    let gapi = getGapi();
    gapi.auth2.getAuthInstance().isSignedIn.listen(this.updateSignInStatus);
    return (
      <div>
        <button className="btn btn-status" onClick={this.googleSignIn}> <span className="fa fa-calendar-plus-o"></span> Google Calendar </button>
        {this.state.signedStatus == "Signed In" ? <span className=" green"> </span> : <span className=" red"> </span> }
      </div>
    )
  }

  render() {
    let self = this;
    if (!this.props.currentUser && !this.props.userEvents) {
      return <Loading />;
    }

    if(!this.props.userEvents){
      return <Loading/>
    }
    if(this.props.userEvents.value==0)
    {
      return (
          //The message is displayed in an alert box with a link that allows user to return to HomePage.
          <div className= "alert alert-danger">
            You are subscribed to 0 classes. Please add classes on your HomePage to generate your schedule.
            <a href="/index_home" class="alert-link" ><strong>Click here to return to HomePage.</strong></a>
          </div>
      )

    }
    //console.log(this.props.userEvents)

    return (
      <div>
        <div>{this.renderGoogle()}</div>
        <div className="trans-sc">
          <BigCalendar
            {...this.props}
            events={this.props.userEvents}
            min={new Date(2017,1,1,8,0,0)}
            max ={new Date(2017,1,1,23,30,0)}
            step={15}
            timeslots={2}
            defaultView="week"
            components={{event: this.titleSect,
              month: {event: this.titleSectMonth}}}
            style={{height: 900}}
            //sweet alert
            onSelectEvent={(event) =>{
              if(event.canEditDescription) {
                swal({
                    title: event.title+event.section+" ("+event.popupType+")",
                    text: "Teacher: "+event.teacher+"\nRoom: "+event.room+"\nTime: "+event.courseTime+"\nDescription: "+event.desc,
                    type: "input",
                    showCancelButton: true,
                    closeOnConfirm: false,
                    animation: "slide-from-top",
                    inputPlaceholder: "Write something"
                  },
                  function(inputValue){
                    if (inputValue === false) return false;

                    if (inputValue === "") {
                      swal.showInputError("You need to write something!");
                      return false
                    }
                    if(event.canEditDescription) {
                      self.props.setDescription(event, inputValue);
                    }
                    swal("Nice!", "You wrote: " + inputValue, "success");
                    event.desc = inputValue;
                  }
                )}
              else {
                swal({
                  title: event.title+event.section+" ("+event.popupType+")",
                  text: "Teacher: "+event.teacher+"\nRoom: "+event.room+"\nTime: "+event.courseTime+"\nDescription: "+event.desc,
                })
              }
            }
            }
            eventPropGetter={this.eventStyleGetter}
            views={["month", "week", "day", "agenda"]} />
        </div>
      </div>
    );
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({ fetchUser, updateUser,getEvents,setDescription }, dispatch);
}

function mapStateToProps(state) {
  return { currentUser: state.currentUser, userEvents: state.userEvents, userCourses: state.userCourses };
}


export default connect(mapStateToProps, mapDispatchToProps)(ScheduleGen);


