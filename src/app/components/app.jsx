import React, { Component } from 'react';
import { browserHistory, Link } from 'react-router';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { fetchUser, logoutUser } from '../actions/firebase_actions';

class App extends Component {

    constructor(props) {
        super(props);

        this.props.fetchUser();
        this.logOut = this.logOut.bind(this);
    }

  componentDidUpdate()
  {
    if(window.location.pathname=="/index_home")
    {
      $(document.body).addClass('bg');
    }

    else
    {
      $(document.body).removeClass('bg');
    }

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

    render() {
      var homeLink ;
      if (this.props.currentUser)
        homeLink = "/index_home";
      else
        homeLink = "/login";

        return (
            <div>
                <header className="navbar navbar-static-top navbar-inverse" id="top" role="banner">
                    <div className="container">
                        <div className="navbar-header">
                            <button
                              className="navbar-toggle collapsed" type="button" data-toggle="collapse"
                              data-target=".bs-navbar-collapse"
                            ><span className="sr-only">Toggle navigation</span>
                                <span className="icon-bar" />
                                <span className="icon-bar" />
                                <span className="icon-bar" />
                            </button>
                            <Link to={homeLink} className="navbar-brand">Concordia University Schedule Exporter (C.U.S.E)</Link>
                        </div>
                        <nav className="collapse navbar-collapse bs-navbar-collapse" role="navigation">
                            <ul className="nav navbar-nav navbar-right">
                                { this.renderUserMenu(this.props.currentUser) }
                            </ul>
                        </nav>
                    </div>
                </header>

                <div className="container">
                    {this.props.children}




                </div>
            </div>
        );
    }
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({ fetchUser, logoutUser }, dispatch);
}


function mapStateToProps(state) {
    return { currentUser: state.currentUser };
}


export default connect(mapStateToProps, mapDispatchToProps)(App);
