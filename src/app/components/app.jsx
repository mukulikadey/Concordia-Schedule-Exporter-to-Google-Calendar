import React, { Component } from 'react';
import { browserHistory, Link } from 'react-router';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { fetchUser, logoutUser,getEvents } from '../actions/firebase_actions';
import './app.scss';


class App extends Component {

  constructor(props) {
    super(props);

    this.props.fetchUser();
    //this.props.getEvents();
    this.logOut = this.logOut.bind(this);
    this.spin = this.spin.bind(this)
  }

  logOut() {
    this.props.logoutUser().then((data) => {
      // reload props from reducer
      this.props.fetchUser();
    });
  }

  renderUserMenu(currentUser) {
    // if current user exists and user id exists than make user navigation
    if (currentUser && currentUser.uid) {
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
            <li><Link to><span className="fa fa-comments" aria-hidden="true"></span> Forum</Link></li>
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

  spin(){
    return <div className="spin"></div>
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
              <li><Link to="/scheduleGen"><span className="fa fa-calendar" aria-hidden="true"></span> Schedule</Link>
              </li>
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
  return bindActionCreators({ fetchUser, logoutUser, getEvents }, dispatch);
}


function mapStateToProps(state) {
  return { currentUser: state.currentUser };
}


export default connect(mapStateToProps, mapDispatchToProps)(App);
