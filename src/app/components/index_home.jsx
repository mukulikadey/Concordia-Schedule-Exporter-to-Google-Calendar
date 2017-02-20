import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { browserHistory, Link } from 'react-router';
import { fetchUser, getUserCourses, getSections } from '../actions/firebase_actions';
import Loading from './helpers/loading';


class Index_home extends Component{

  constructor(props) {
    super(props);
    this.props.fetchUser();
    this.state = {
      message: '',
      searching: false,
      course_name: "",
    };
    this.onFormSubmit = this.onFormSubmit.bind(this);
    this.handleAdd = this.handleAdd.bind(this);
    this.handleForm = this.handleForm.bind(this);
    this.handleChange = this.handleChange.bind(this);
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

  getCourses()
  {
    if(this.props.currentUser && !this.props.databaseInfo.courses)
    {
      this.props.getUserCourses()
    }

    if(this.props.databaseInfo&& this.props.databaseInfo.loaded && this.props.databaseInfo.courses && this.props.databaseInfo.courses[0]!='No Courses')
    return this.props.databaseInfo.courses.map((course)=>{
      return <p key={course.coursename}>{course.coursename}</p>
    })

    else if(!this.props.databaseInfo.courses)
    {
      return <Loading/>
    }

    else
    {return <p>No Courses in Database</p>}
  }

  handleAdd()
  {
    this.setState({searching: !this.state.searching});
  }
  handleChange(event) {
    //Making sure that the course name is in capital letters just like in the database
    var search_input = event.target.value.toUpperCase();
    this.setState({course_name: search_input});
  }
  handleForm()
  {
    var sections = this.props.getSections(this.state.course_name);
    console.log(sections);
  }

  render() {
    if (!this.props.currentUser) {
      return <Loading />;
    }
    return (
      <div>
        {this.renderName(this.props.currentUser)}
        <div className="welcomeHome">
            <div className="transBox">
              <p>Here is the list of classes you are taking:</p>

                {this.getCourses()}
              {this.renderSearchBar()}<br/><br/>
            </div>

            <p>
              <Link to="/profile"><button type="button" className="home btn btn-info btn-lg"><span className="fa fa-user"></span>    Profile </button></Link>
              <Link to="/scheduleGen"><button type="button" className="home btn btn-success btn-lg"><span className="fa fa-calendar"></span>    Schedule </button></Link>
              <a href="#"><button type="button" className="home btn btn-warning btn-lg"><span className="fa fa-comments"></span>    Forum </button></a>
            </p>
        </div>
      </div>

    );

  }
  renderName(currentUser)
  {
    if(currentUser && currentUser.uid)
      return <div className="welcomeHome">Welcome {currentUser.displayName}!</div>
    return <div></div>
  }

  renderSearchBar()
  {
    //If the user has clicked on add course, pull up the search bar. If not, show the add button.
    if(this.state.searching){
      return <a href="#">
        <form onSubmit={this.handleForm}><input type="search" value={this.state.value} onChange={this.handleChange} placeholder="Ex: COEN346" autoFocus/>
        </form>
        <span onClick={this.handleAdd} className="fa fa-plus-circle"></span></a>;
    }
    else
    {
      return <a href="#" onClick={this.handleAdd}><span className="fa fa-plus-circle"></span> Add Text</a>
    }
  }


}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({ fetchUser, getUserCourses, getSections}, dispatch);
}


function mapStateToProps(state) {
  return { currentUser: state.currentUser, databaseInfo: state.databaseInfo };
}


export default connect(mapStateToProps, mapDispatchToProps)(Index_home);


