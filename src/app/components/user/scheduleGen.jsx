import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import firebase from '../../utils/firebase';


import { fetchUser, updateUser } from '../../actions/firebase_actions';
import Loading from '../helpers/loading';
import ChangePassword from './change_password';

class ScheduleGen extends Component {

  constructor(props) {
    super(props);
    this.props.fetchUser();
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

  render() {
    if (!this.props.currentUser) {
      return <Loading />;
    }

    return (
      <div>
        <div className="cd-schedule loading">
          <div className="timeline">
            <ul>
              <li><span>08:00</span></li>
              <li><span>08:30</span></li>
              <li><span>09:00</span></li>
              <li><span>09:30</span></li>
              <li><span>10:00</span></li>
              <li><span>10:30</span></li>
              <li><span>11:00</span></li>
              <li><span>11:30</span></li>
              <li><span>12:00</span></li>
              <li><span>12:30</span></li>
              <li><span>13:00</span></li>
              <li><span>13:30</span></li>
              <li><span>14:00</span></li>
              <li><span>14:30</span></li>
              <li><span>15:00</span></li>
              <li><span>15:30</span></li>
              <li><span>16:00</span></li>
              <li><span>16:30</span></li>
              <li><span>17:00</span></li>
              <li><span>17:30</span></li>
              <li><span>18:00</span></li>
              <li><span>18:30</span></li>
              <li><span>19:00</span></li>
              <li><span>19:30 </span></li>
              <li><span>20:00</span></li>
              <li><span>20:30</span></li>
              <li><span>21:00</span></li>
              <li><span>21:30</span></li>
              <li><span>22:00</span></li>
              <li><span>22:30</span></li>
              <li><span>23:00</span></li>
              <li><span>23:30</span></li>
            </ul>
          </div>
          {/* .timeline */}
          <div className="events">
            <ul>
              <li className="events-group">
                <div className="top-info"><span>Monday</span></div>
                <ul>
                </ul>
              </li>
              <li className="events-group">
                <div className="top-info"><span>Tuesday</span></div>
                <ul>
                </ul>
              </li>
              <li className="events-group">
                <div className="top-info"><span>Wednesday</span></div>
                <ul>
                </ul>
              </li>
              <li className="events-group">
                <div className="top-info"><span>Thursday</span></div>
                <ul>
                </ul>
              </li>
              <li className="events-group">
                <div className="top-info"><span>Friday</span></div>
                <ul>
                </ul>
              </li>
            </ul>
          </div>
        </div>
      </div>
    );
  }
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({ fetchUser, updateUser }, dispatch);
}

function mapStateToProps(state) {
    return { currentUser: state.currentUser };
}

export default connect(mapStateToProps, mapDispatchToProps)(ScheduleGen);


