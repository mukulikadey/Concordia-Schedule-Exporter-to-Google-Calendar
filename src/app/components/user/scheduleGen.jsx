import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import firebase from '../../utils/firebase';
import BigCalendar from 'react-big-calendar';
import  '../user/react-big-calendar.css';
import moment from 'moment';
import localizer from 'react-big-calendar/lib/localizers/moment';
import events from '../user/events';
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
    };
    this.onFormSubmit = this.onFormSubmit.bind(this);
  }
  
  componentDidUpdate()
  {
    console.log(this.props.userEvents)
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

  render() {
    
    if (!this.props.currentUser && !this.props.userEvents) {
      this.props.getEvents()
      return <Loading />;
    }
    //console.log(this.props.userEvents)
    return (
      <div className="trans-sc">
          <BigCalendar
            {...this.props}
            events={events}
            min={new Date(2017,1,1,8,0,0)}
            max ={new Date(2017,1,1,23,30,0)}
            step={15}
            timeslots={2}
            defaultView="week"
            style={{height: 800}}

            onSelectEvent={event => alert(event.desc)}
            eventPropGetter={this.eventStyleGetter}
            views={["month", "week", "day",]}/>
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


