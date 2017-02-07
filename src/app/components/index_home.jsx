import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';


import { fetchUser } from '../actions/firebase_actions';
import Loading from './helpers/loading';


class Index_home extends Component{

  constructor(props) {
    super(props);
    this.props.fetchUser();
    this.state = {
      message: '',
    };
    this.onFormSubmit = this.onFormSubmit.bind(this);
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
        {this.renderName(this.props.currentUser)}
        <div>
            <b>About</b>
            <p>This is the about paragraph.</p>
        </div>
      </div>

    );

  }
  renderName(currentUser)
  {
    if(currentUser && currentUser.uid)
      return <div>Welcome {currentUser.displayName}!</div>
    return <div></div>
  }

}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({ fetchUser}, dispatch);
}


function mapStateToProps(state) {
  return { currentUser: state.currentUser };
}


export default connect(mapStateToProps, mapDispatchToProps)(Index_home);


