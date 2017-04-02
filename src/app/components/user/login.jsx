import React, { Component } from 'react';
import { browserHistory, Link } from 'react-router';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { loginUser, fetchUser, loginWithProvider } from '../../actions/firebase_actions';
import UserRegister from './register';


class UserLogin extends Component {

    constructor(props) {
        super(props);
        this.onFormSubmit = this.onFormSubmit.bind(this);
        this.loginWithProvider = this.loginWithProvider.bind(this);
        this.state = {
            message: '',
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
                this.setState({ message: data.payload.errorMessage });
            } else {
                browserHistory.push('/index_home');
            }
        }
    );
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
              <div className='col-md-4 box'>
                <div className='wave -one'></div>
                <div className='wave -two'></div>
                <div className='wave -three'></div>
                <form id="frmLogin" role="form" onSubmit={this.onFormSubmit}>
                  <p>
                    {this.state.message}
                  </p>
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
                  <button type="submit" className="btn btn-default btn-block">Login</button>
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
