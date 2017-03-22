import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import firebase from '../../utils/firebase';
import BigCalendar from 'react-big-calendar';
import  '../user/react-big-calendar.css';
import moment from 'moment';
import localizer from 'react-big-calendar/lib/localizers/moment';
import { fetchUser, updateUser,getEvents } from '../../actions/firebase_actions';
import Loading from '../helpers/loading';
import ChangePassword from './change_password';

BigCalendar.momentLocalizer(moment);
localizer(moment);


class ScheduleGen extends Component {

  constructor(props) {
    super(props);
    this.props.fetchUser();
    this.props.getEvents();


    this.state = {
      message: '',
      signedStatus: "Signed Out"
    };
    this.onFormSubmit = this.onFormSubmit.bind(this);
    this.exportEvents = this.exportEvents.bind(this);
    this.updateSigninStatus = this.updateSigninStatus.bind(this);
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
    console.log(event);
    var backgroundColor = '#' + event.hexColor;
    var style = {
      backgroundColor: backgroundColor,
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

  exportEvents(){
    let gapi = getGapi();
    gapi.auth2.getAuthInstance().signIn();

    if(this.state.signedStatus == "Signed In"){
      let batch = gapi.client.newBatch(); //For batch requests
      let events = this.props.userEvents; //Get course events of the user

      console.log(events);
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
  }

  updateSigninStatus() {
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
    gapi.auth2.getAuthInstance().isSignedIn.listen(this.updateSigninStatus);
    return (
      <div>
        <button className="btn-google" onClick={this.exportEvents}>Export to Calendar</button>
        <text>{this.state.signedStatus}</text>
      </div>
    )
  }

  render() {
    if (!this.props.currentUser && !this.props.userEvents) {
      this.props.getEvents()
      return <Loading />;
    }
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
            defaultView="day"
            style={{height: 800}}

            onSelectEvent={event => alert(event.desc)}
            eventPropGetter={this.eventStyleGetter}
            views={["month", "week", "day",]}/>
      </div>
      </div>
    );
  }
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({ fetchUser, updateUser,getEvents }, dispatch);
}

function mapStateToProps(state) {
    return { currentUser: state.currentUser, userEvents: state.userEvents };
}


export default connect(mapStateToProps, mapDispatchToProps)(ScheduleGen);


