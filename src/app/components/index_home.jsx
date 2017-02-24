import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { browserHistory, Link } from 'react-router';
import { fetchUser, getUserCourses, getSections, addUserSection } from '../actions/firebase_actions';
import Loading from './helpers/loading';


class Index_home extends Component{

  constructor(props) {
    super(props);
    this.props.fetchUser();
    this.state = {
      message: '',
      searching: false,
      display_sections: "",
      course_name: "",
    };
    this.handleAdd = this.handleAdd.bind(this);
    this.handleForm = this.handleForm.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }


  getCourses()
  {

    if(this.props.currentUser && !this.props.userCourses.courses)
    {
      this.props.getUserCourses()

    }

    if(this.props.userCourses&& this.props.userCourses.loaded && this.props.userCourses.courses && this.props.userCourses.courses[0]!='No Courses')
    return this.props.userCourses.courses.map((course)=>{
      return <p key={course.coursename}>{course.coursename}</p>
    })

    else if(!this.props.userCourses.courses)
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
       this.props.getSections(this.state.course_name).then((data) => {
        // reload props from reducer
        this.setState({display_sections: data});
        });
  }

  addSection(newSection)
  {
    if(this.props.userCourses && this.props.userCourses.loaded && this.props.userCourses.courses)
    {
      // Make sure courseArray is empty if it hasn't been initialized yet instead of holding 'No Courses' value
      let courseArray = this.props.userCourses.courses[0] == 'No Courses'? [] : this.props.userCourses.courses;

      // Update the Firebase database by adding the nwe section to the user's CourseArray
      this.props.addUserSection(courseArray, this.state.course_name,newSection);
    }
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

              {this.renderSectionResult()}
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
      return <a href="#" onClick={this.handleAdd}><span className="fa fa-plus-circle"></span> Add Courses </a>
    }
  }
  renderSectionResult()
  {
    let sections_array = this.props.sections;

    if(this.state.searching && sections_array != undefined) {
      let return_render = [];
      for(let i = 0; i < sections_array.length; i++) {
        // bind function prepends the arguments to the function so that it cna be passed as a variable with args already set
        let sectionClick = this.addSection.bind(this,sections_array[i]);
        return_render.push(<button key={sections_array[i].section.toString()} onClick = {sectionClick} type="button" className="btn btn-default"><a href="#">{sections_array[i].section}</a></button>);
      }

      return <div>{return_render}</div>;
    }
    return <div></div>;
  }


}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({ fetchUser, getUserCourses, getSections, addUserSection}, dispatch);
}


function mapStateToProps(state) {
  return { currentUser: state.currentUser, userCourses: state.userCourses,sections:state.sections };
}


export default connect(mapStateToProps, mapDispatchToProps)(Index_home);


