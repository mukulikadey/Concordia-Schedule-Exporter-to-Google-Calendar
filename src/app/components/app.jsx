import React, { Component } from 'react';
import { browserHistory, Link } from 'react-router';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { fetchUser, logoutUser,getEvents,getNotifications, removeNotification } from '../actions/firebase_actions';
import {Popover, OverlayTrigger} from 'react-bootstrap'

let notifIconRed = "";
let notifCounter = "";
let overlay ="bottom";
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

  removeNotification(key) {
    this.props.removeNotification(key);
    notifCounter = "";
    notifIconRed = "";
  }

  returnNotifications() {
    let array = [];
    let i=0;
    let notify = this.props.notifications;
    if (this.props.notifications && this.props.notifications !== "No notifications") {
      Object.keys(notify).map(function (key) {
        array.push(<div>{notify[key].event.title + notify[key].event.section + " (" + notify[key].event.datePath  + ")\n" + notify[key].event.courseTime + ":  "}<span className="fa fa-times-circle hover" onClick={this.removeNotification.bind(this, key)}></span><br /><span className="newDescNotif">{notify[key].event.desc + " \n"}</span><br /><span className="fa fa-user "></span>  <span className="small">{notify[key].editor}</span>  &nbsp;&nbsp;&nbsp; <span className="fa fa-pencil-square-o"></span>  <span className="small">{notify[key].timeStamp} </span></div>,<hr className="hrNotifs" />);
        i++;
        notifCounter = array.length/2;
        notifIconRed=<span className="counterNotif" aria-hidden="true">{notifCounter}</span>
        overlay="bottom";
      }, this);
      return <div>{array}</div>

    }
    else {
      array[0]=(<div> No new notifications </div>);
      overlay= "right";
      return <div> {array}</div>
    }
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
        {this.returnNotifications()}
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
              <li><Link to="."><OverlayTrigger trigger="click" rootClose placement={overlay} overlay={popoverClickRootClose} className="fixed">
                <span className=" gold fa fa-bell" aria-hidden="true">{notifIconRed} <span className="arial gold">&nbsp;Notifications </span></span>
              </OverlayTrigger></Link></li>
            </ul>
            <ul className="nav navbar-nav navbar-right">
              <li><Link to="/login" onClick={this.logOut}> <span className="fa fa-sign-out" aria-hidden="true"></span> Logout</Link></li>
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
