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
import 'sweetalert';
import '../user/sweetalert.css';

BigCalendar.momentLocalizer(moment);
localizer(moment);


class ScheduleGen extends Component {

  constructor(props) {
    super(props);
    this.props.fetchUser();
    this.props.getEvents();


    this.state = {
      message: '',
    };
    this.onFormSubmit = this.onFormSubmit.bind(this);
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

  render() {

    if (!this.props.currentUser && !this.props.userEvents) {
      this.props.getEvents()
      return <Loading />;
    }
    console.log(this.props.userEvents)
    return (
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
          //sweet alert
          onSelectEvent={event =>swal({
              title: event.title,
              text: "Teacher: "+event.teacher+"\nRoom: "+event.room+"\nTime: "+event.courseTime,
              /*"Here's a custom message."*/
              /**text: "Class Details:",
               type: "input",
               showCancelButton: true,
               closeOnConfirm: false,
               animation: "slide-from-top",
               inputPlaceholder: "Write something"**/
            }
            /** function(inputValue){
                if (inputValue === false) return false;

                if (inputValue === "") {
                  swal.showInputError("You need to write something!");
                  return false
                }

                swal("Nice!", "You wrote: " + inputValue, "success");
              }**/
          )}
          eventPropGetter={this.eventStyleGetter}
          views={["month", "week", "day",]} />
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


