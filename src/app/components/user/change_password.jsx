import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { changePassword } from '../../actions/firebase_actions';
import {Alert} from 'react-bootstrap'

class ChangePassword extends Component {

  constructor(props) {
    super(props);
    this.onFormSubmit = this.onFormSubmit.bind(this);
    this.handleAlertDismiss=this.handleAlertDismiss.bind(this);
    this.handleSuccessDismiss=this.handleSuccessDismiss.bind(this);
    this.state = {
      message: '',
      alertVisible: false,
      successVisible: false,
    };
  }

  onFormSubmit(event) {
    event.preventDefault();
    let password = this.refs.password.value;
    let repeatPassword = this.refs.repeatPassword.value;
    if (password !== repeatPassword) {
      this.setState({alertVisible: !this.state.alertVisible});
      this.setState({
        message: 'Password does not match!',
      });
    } else {
      this.props.changePassword(password).then((data) => {
        if (data.payload.errorCode) {
          this.setState({alertVisible: !this.state.alertVisible});
          this.setState({message: data.payload.errorMessage});
        }
        else {
          this.setState({successVisible: !this.state.successVisible});
          this.setState({message: 'Password was changed!'});
        }
      });
    }
  }

  handleAlertDismiss() {
    this.setState({alertVisible: !this.state.alertVisible});
  }

  handleSuccessDismiss() {
    this.setState({successVisible: !this.state.successVisible});
  }

  alert() {
    if (this.state.alertVisible) {
      return (<Alert bsStyle="danger" onDismiss={this.handleAlertDismiss}>
        <p> {this.state.message}</p>
      </Alert>)
    }
  }

  success() {
    if (this.state.successVisible) {
      return (<Alert bsStyle="success" onDismiss={this.handleSuccessDismiss}>
        <p> {this.state.message}</p>
      </Alert>)
    }
  }

  render() {
    return (
      <div>
        <form id="changePassword" role="form" onSubmit={this.onFormSubmit}>
          <h4 className="align-center"> Change Password </h4>
          <div className="form-group">
            <label htmlFor="password"> New Password: </label>
            <div className="input-group">
              <div className="input-group-addon">
                <span className="fa fa-lock fa-lg" aria-hidden="true"></span>
              </div>
              <input type="password" className="form-control"
                     name="password" ref="password" id="password"
              />
            </div>
          </div>
          <div className="form-group">
            <label htmlFor="repeatPassword"> Confirm Password: </label>
            <div className="input-group">
              <div className="input-group-addon">
                <span className="fa fa-lock fa-lg" aria-hidden="true"></span>
              </div>
              <input type="password" className="form-control"
                     name="repeatPassword" ref="repeatPassword" id="repeatPassword"
              />
            </div>
          </div>
          <button type="submit" className="btn btn-primary btn-round btn-center2"> Change Password</button>
        </form>
        <div className="centerAlertPassword">
          {this.alert()}
          {this.success()}
        </div>
      </div>

    );
  }

}


function mapDispatchToProps(dispatch) {
  return bindActionCreators({ changePassword }, dispatch);
}

function mapStateToProps(state) {
  return { currentUser: state.currentUser };
}

export default connect(mapStateToProps, mapDispatchToProps)(ChangePassword);
