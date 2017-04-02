import React, { Component } from 'react';
import { browserHistory } from 'react-router';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { registerUser } from '../../actions/firebase_actions';

class UserRegister extends Component {
    constructor(props) {
        super(props);
        this.onFormSubmit = this.onFormSubmit.bind(this);
        this.state = {
            message: '',
        };
    }

     mathLib(a) {
        return a + 5;
    }

    onFormSubmit(event) {
        event.preventDefault();

        const email = this.refs.email.value;
        const password = this.refs.password.value;
        this.props.registerUser({ email, password }).then((data) => {
            if (data.payload.errorCode) {
                this.setState({ message: data.payload.errorMessage })
              ;
            } else {
                browserHistory.push('/index_home');
            }
        }
    );
    }

    render() {
        return (
          <div className="col-md-4 box">
            <div className='wave -one'></div>
            <div className='wave -two'></div>
            <div className='wave -three'></div>
            <form id="frmRegister" role="form" onSubmit={this.onFormSubmit}>
              <p>{this.state.message}</p>
              <h2 className="align-center">Register</h2><br />
              <div className="form-group">
                <label htmlFor="txtRegEmail">Email address</label>
                <div className="input-group">
                  <div className="input-group-addon">
                    <span className="fa fa-envelope fa" aria-hidden="true"></span>
                  </div>
                  <input
                    type="email" className="form-control " ref="email" id="txtEmail" placeholder="example@live.ca"
                    name="email"
                  />
                </div>
              </div>
              <div className="form-group">
                <label htmlFor="txtRegPass">Password</label>
                <div className="input-group">
                  <div className="input-group-addon">
                    <span className="fa fa-lock fa-lg" aria-hidden="true"></span>
                  </div>
                  <input
                    type="password" className="form-control" ref="password" id="txtPass" placeholder="********"
                    name="password"
                  />
                </div>
              </div>
              <button type="submit" className="btn btn-default btn-block">Register</button>
              <br /> <br />
            </form>
          </div>

        );
    }

}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        registerUser,
    }, dispatch);
}

function mapStateToProps(state) {
    return { currentUser: state.currentUser };
}

export default connect(mapStateToProps, mapDispatchToProps)(UserRegister);
