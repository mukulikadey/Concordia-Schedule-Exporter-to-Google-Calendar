import React, { Component } from 'react';
import { browserHistory } from 'react-router';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { registerUser } from '../../actions/firebase_actions';
import {Alert} from 'react-bootstrap'

class UserRegister extends Component {
  constructor(props) {
    super(props);
    this.onFormSubmit = this.onFormSubmit.bind(this);
    this.handleAlertDismiss=this.handleAlertDismiss.bind(this);
    this.state = {
      message: '',
      alertVisible: false,
    };
  }

  mathLib(a) {
    return a + 5;
  }

  componentDidMount(){
    document.body.className = "";
  }

  onFormSubmit(event) {
    event.preventDefault();

    const email = this.refs.email.value;
    const password = this.refs.password.value;
    this.props.registerUser({ email, password }).then((data) => {
        if (data.payload.errorCode) {
          this.setState({alertVisible : !this.state.alertVisible});
          this.setState({ message: data.payload.errorMessage })
          ;
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

  render() {
    return (
      <div>
        <div className="row center">
          <div className="col-md-4 box boxReg fadeInHome">
            <form id="frmRegister" role="form" onSubmit={this.onFormSubmit}>
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
        </div>
        {this.alert()}
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
