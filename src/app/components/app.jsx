import React, { Component } from 'react';
import { browserHistory, Link } from 'react-router';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { fetchUser, logoutUser,getEvents,getNotifications, removeNotification } from '../actions/firebase_actions';
import {Popover, OverlayTrigger} from 'react-bootstrap'

class App extends Component {

  constructor(props) {
    super(props);
    this.props.fetchUser();
    this.logOut = this.logOut.bind(this);
    this.returnNotifications = this.returnNotifications.bind(this);
    this.removeNotification = this.removeNotification.bind(this);
  }

  componentDidMount() {
    this.props.getNotifications();
  }

  componentDidUpdate(){
    if(!this.props.notifications) {
      this.props.getNotifications()
    }
  }

  logOut() {
    this.props.logoutUser().then((data) => {
      // reload props from reducer
      this.props.fetchUser();
      gapi.auth2.getAuthInstance().signOut();
    });
  }

  renderUserMenu(currentUser) {
    // if current user exists and user id exists than make user navigation
    if (currentUser && currentUser.uid) {
      this.props.getEvents();
      return (
        <li className="dropdown">
          <a
            href="#" className="dropdown-toggle" data-toggle="dropdown" role="button"
            aria-haspopup="true" aria-expanded="false"
          >
            {currentUser.email} <span className="caret" /></a>
          <ul className="dropdown-menu">
            <li><Link to="/profile"><span className="fa fa-user" aria-hidden="true"></span> Profile</Link></li>
            <li role="separator" className="divider" />
            <li><Link to="/scheduleGen"><span className="fa fa-calendar" aria-hidden="true"></span> Schedule</Link></li>
            <li role="separator" className="divider" />
            <li><Link to="/login" onClick={this.logOut}> <span className="fa fa-sign-out" aria-hidden="true"></span> Logout</Link></li>
          </ul>
        </li>
      );
    } else {
      return [
        <li key={1}><Link to="/login">Login/Register</Link></li>,
      ];
    }
  }

  removeNotification(key){
    this.props.removeNotification(key);
  }

  returnNotifications() {
    let array = [];
    let i=0;
    let notify = this.props.notifications;
    if (this.props.notifications && this.props.notifications !== "No notifications") {
      Object.keys(notify).map(function (key) {
        array.push(<div>{notify[key].event.title + notify[key].event.section  + "\n" + notify[key].event.courseTime + ": \n"}<br />{notify[key].event.desc} <span  className="fa fa-times-circle" onClick={this.removeNotification.bind(this, key)}> </span><hr className="hrNotifs" /></div>);
        i++;
      }, this);
      return <div>{array}</div>
    }
    return <div></div>
  }

  logoutNav(){
    return<div>
      <img className="img logoutBox " src="/src/logo_gold.png" height={65} onLoad={this.spin}/>

      <div className="containerLogout">
        {this.props.children}
      </div>
    </div>
  }

  loginNav() {
    const popoverClickRootClose = (
      <Popover id="popover-trigger-click-root-close" title="Notifications">
        {this.returnNotifications()}.
      </Popover>
    );
    if (this.props.currentUser) {
      var homeLink = "/index_home";
      return <div>
        <header className="navbar navbar-light" role="banner">
          <div className="container">
            <div className="navbar-header">
              <Link to={homeLink} className="navbar-brand"><img className="img" src="/src/logo_gold.png" height={45}/></Link>
            </div>
            <ul className="nav navbar-nav">
              <li><Link to="/profile"><span className="fa fa-user" aria-hidden="true"></span> Profile</Link></li>
              <li><Link to="/scheduleGen"><span className="fa fa-calendar" aria-hidden="true"></span> Schedule</Link></li>
              <li><Link to="."><OverlayTrigger trigger="click" rootClose placement="right" overlay={popoverClickRootClose}>
                <span className=" gold fa fa-bell" aria-hidden="true"><span className="arial gold"> Notification</span></span>
              </OverlayTrigger></Link></li>
            </ul>
            <ul className="nav navbar-nav navbar-right">
              <li><Link to="/login" onClick={this.logOut}> <span className="fa fa-sign-out" aria-hidden="true"></span>
                Logout</Link></li>
            </ul>

          </div>
        </header>
        <div className="container">
          {this.props.children}
        </div>
      </div>
    }
  }

  render() {
    return(
      <div>
        {this.props.currentUser ? this.loginNav() : this.logoutNav()}
      </div>
    )
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({ fetchUser, logoutUser, getEvents, getNotifications, removeNotification }, dispatch);
}


function mapStateToProps(state) {
  return { currentUser: state.currentUser, notifications: state.notifications };
}


export default connect(mapStateToProps, mapDispatchToProps)(App);




