import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import firebase from '../../utils/firebase';


import { fetchUser, updateUser } from '../../actions/firebase_actions';
import Loading from '../helpers/loading';
import ChangePassword from './change_password';

class UserProfile extends Component {

    constructor(props) {
        super(props);
        this.props.fetchUser();
        this.state = {
            message: '',
        };
        this.onFormSubmit = this.onFormSubmit.bind(this);
    }

  componentDidMount(){
        document.body.className = "";
  }

  onFormSubmit(event) {
        event.preventDefault();
        const email = this.refs.email.value;
        const displayName = this.refs.displayName.value;
        this.props.updateUser({ email, displayName }).then((data) => {
            if (data.payload.errorCode) {
                this.setState({ message: data.payload.errorMessage });
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

              <div className="trans">
              <form id="frmProfile" role="form" onSubmit={this.onFormSubmit}>
                    <center><h4>My Profile</h4></center>
                    <p>{this.state.message}</p>

                    <div className="form-group">
                        <label htmlFor="email">Email: </label>
                        <input
                          type="text" defaultValue={this.props.currentUser.email}
                          className="form-control" id="email" ref="email" placeholder="Email" name="email"
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="displayName">Display name: </label>
                        <input
                          type="text" defaultValue={this.props.currentUser.displayName}
                          className="form-control" ref="displayName" id="displayName" placeholder="Display name"
                          name="displayName"
                        />
                    </div>
                    <center><button type="submit" className="btn btn-primary">Update</button></center>
                </form><hr />
                <ChangePassword />
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


export default connect(mapStateToProps, mapDispatchToProps)(UserProfile);
