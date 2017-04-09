import React, { Component } from 'react';
import { browserHistory, Link } from 'react-router';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { loginUser, fetchUser, loginWithProvider } from '../../actions/firebase_actions';
import UserRegister from './register';
import {Alert} from 'react-bootstrap'


class UserLogin extends Component {

  constructor(props) {
    super(props);
    this.onFormSubmit = this.onFormSubmit.bind(this);
    this.loginWithProvider = this.loginWithProvider.bind(this);
    this.handleAlertDismiss=this.handleAlertDismiss.bind(this);
    this.state = {
      message: '',
      alertVisible: false,
    };
  }

  componentDidMount(){
    document.body.className = "";
  }

  onFormSubmit(event) {
    event.preventDefault();
    const email = this.refs.email.value;
    const password = this.refs.password.value;
    this.props.loginUser({ email, password }).then((data) => {
        if (data.payload.errorCode) {
          this.setState({alertVisible : !this.state.alertVisible});
          this.setState({ message: data.payload.errorMessage });
        } else {
          browserHistory.push('/index_home');
        }
      }
    );
  }

  handleAlertDismiss() {
    this.setState({alertVisible: !this.state.alertVisible});
  }

  alert() {
    if (this.state.alertVisible) {
      return (<Alert bsStyle="danger" onDismiss={this.handleAlertDismiss}>
        <p> {this.state.message}</p>
      </Alert>)
    }
  }

  loginWithProvider(provider) {
    this.props.loginWithProvider(provider).then((data) => {
      if (data.payload.errorCode) {
        this.setState({ message: data.payload.errorMessage });
      } else {
        browserHistory.push('/index_home');
      }
    });
  }

  render() {
    return (
      <div>
        <div className="row center">
          <div className='col-md-4 box fadeInHome'>
            <form id="frmLogin" role="form" onSubmit={this.onFormSubmit}>
              <h2 className="align-center">Login</h2><br />
              <div className="form-group">
                <label htmlFor="txtEmail">Email address</label>
                <div className="input-group">
                  <div className="input-group-addon">
                    <span className="fa fa-envelope fa" aria-hidden="true"></span>
                  </div>
                  <input
                    type="email" className="form-control" id="txtEmail" ref="email" placeholder="example@live.ca"
                    name="email"
                  />
                </div>
              </div>
              <div className="form-group">
                <label htmlFor="txtPass">Password</label>
                <div className="input-group">
                  <div className="input-group-addon">
                    <span className="fa fa-lock fa-lg" aria-hidden="true"></span>
                  </div>
                  <input
                    type="password" className="form-control" id="txtPass" ref="password" placeholder="********"
                    name="password"
                  />
                </div>
              </div>
              <button type="submit" className="btn btn-default btn-block" onClick={this.onFormSubmit}>Login</button>
              <br />
              <h5><Link to="/reset">Forgot password?</Link></h5>

              <a
                href="#" className="btn btn-block btn-social btn-google btn-login" onClick={() => {
                this.loginWithProvider('google');
              }} data-provider="google"
              ><span className="fa fa-google"></span> Sign in with Gmail</a><span className="GoogleLoginWarning">Sign in with Gmail is required to export schedule to Google Calendar</span>
            </form>

          </div>
          <UserRegister/>
        </div><br />
        <div className="centerAlert">
          {this.alert()}
        </div>
      </div>

    );
  }

}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    loginUser,
    fetchUser,
    loginWithProvider,
  }, dispatch);
}

function mapStateToProps(state) {
  return { currentUser: state.currentUser };
}

export default connect(mapStateToProps, mapDispatchToProps)(UserLogin);
