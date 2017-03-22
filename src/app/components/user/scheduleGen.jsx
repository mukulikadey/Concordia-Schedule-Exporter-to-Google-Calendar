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
    this.props.getEvents();
    //this.props.setDescription(this,1,1,1);

    this.state = {
      events: this.props.userEvents,
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

  render() {
    let self = this;
    if (!this.props.currentUser && !this.props.userEvents) {
      this.props.getEvents()
      return <Loading />;
    }
    console.log(this.props.userEvents)
    return (
      <div className="trans-sc">
        <BigCalendar
          {...this.props}
          events={this.state.events}
          min={new Date(2017,1,1,8,0,0)}
          max ={new Date(2017,1,1,23,30,0)}
          step={15}
          timeslots={4}
          defaultView="week"
          components={{event: this.titleSect,
          month: {event: this.titleSectMonth}}}
          style={{height: 710}}
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
                 console.log(event.sectionPath + event.datePath + inputValue);
                 if(event.canEditDescription) {
                  self.props.setDescription(event.sectionPath,event.datePath, inputValue);
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
          views={["month", "week", "day",]} />
      </div>


    );
  }
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({ fetchUser, updateUser,getEvents,setDescription }, dispatch);
}

function mapStateToProps(state) {
    return { currentUser: state.currentUser, userEvents: state.userEvents };
}


export default connect(mapStateToProps, mapDispatchToProps)(ScheduleGen);


