import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { browserHistory, Link } from 'react-router';
import { fetchUser, getUserCourses, getSections, addUserSection,deleteCourse, isProfessor,getNotifications, addTA, removeNotification } from '../actions/firebase_actions';
import Loading from './helpers/loading';
import 'sweetalert';
import './user/sweetalert.css';
import Loadable from 'react-loading-overlay'


class Index_home extends Component{

  constructor(props) {
    super(props);
    this.props.fetchUser();
    this.props.getUserCourses();
    this.state = {
      message: '',
      searching: false,
      display_sections: "",
      course_name: "",
      counter:0,
    };
    this.handleAdd = this.handleAdd.bind(this);
    this.handleForm = this.handleForm.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.onkeyPress=this.onkeyPress.bind(this);
    this.remove=this.remove.bind(this);
    this.refresh=this.refresh.bind(this);
    this.submitInfo=this.submitInfo.bind(this);
    this.submitButton=this.submitButton.bind(this);
    this.removeNotification = this.removeNotification.bind(this);
    this.hideAddTa=this.hideAddTa.bind(this)
    this.showAddTa=this.showAddTa.bind(this)

  }

  componentDidMount(){
    document.body.className = "";
    this.props.isProfessor();
    this.props.getNotifications();

    // TODO This will be moved to wherever the check needs to be made by Front-End team
    if (this.props.profState == 'Not a professor'){
      // do somethingg
    }
  }

  componentDidUpdate(){
    if(this.props.userCourses &&  !this.props.userCourses.courses) {
      this.props.getUserCourses()
    }

    // wait for profState
    if(!this.props.profState){
      this.props.isProfessor();
    }

    // wait for notifications
    if(!this.props.notifications) {
      this.props.getNotifications()
    }

  }

  remove(course){
    var self=this;
    swal({
        title:"",
        text: "Are you sure you want to delete "+ course.coursename+"?",
        type: "warning",
        showCancelButton: true,
        confirmButtonColor: "#DD6B55",
        confirmButtonText: "Yes, delete it!",
        closeOnConfirm: false
      },
      function(){
        swal("Deleted!", course.coursename+" has been deleted.", "success", );
        self.props.deleteCourse(self.props.userCourses.courses,course)
      });
  }

  removeNotification(key){
    this.props.removeNotification(key);
  }

  getCourses()
  {
    if(this.props.currentUser && !this.props.userCourses.courses)
    {
      this.props.getUserCourses()

    }

    if(this.props.userCourses&& this.props.userCourses.loaded && this.props.userCourses.courses && this.props.userCourses.courses[0]!='No Courses')
      return this.props.userCourses.courses.map((course)=>{
        if(course.labsection==null && course.tutorialsection==null)
          return <p className="parent" key={course.coursename}>{course.coursenumber} <span onClick={this.remove.bind(this,course)} className="hiding fa fa-times-circle"></span><span className="courseList">{"("+course.section+")"}</span></p>;
        else if(course.section==null && course.tutorialsection==null)
          return <p className="parent" key={course.coursename}>{course.coursenumber} <span onClick={this.remove.bind(this,course)} className="hiding fa fa-times-circle"></span><span className="courseList">{"("+course.labsection+")"}</span></p>;
        else if(course.section==null && course.labsection==null)
          return <p className="parent" key={course.coursename}>{course.coursenumber} <span onClick={this.remove.bind(this,course)} className="hiding fa fa-times-circle"></span><span className="courseList">{"("+course.tutorialsection+")"}</span></p>;
        else if(course.labsection==null)
          return <p className="parent" key={course.coursename}>{course.coursenumber} <span onClick={this.remove.bind(this,course)} className="hiding fa fa-times-circle"></span><span className="courseList">{"("+course.section+"/"+course.tutorialsection+")"}</span></p>;
        else if(course.tutorialsection==null)
          return <p className="parent" key={course.coursename}>{course.coursenumber} <span onClick={this.remove.bind(this,course)} className="hiding fa fa-times-circle"></span><span className="courseList">{"("+course.section+"/"+course.labsection+")"}</span></p>;
        else if(course.section==null)
          return <p className="parent" key={course.coursename}>{course.coursenumber} <span onClick={this.remove.bind(this,course)} className="hiding fa fa-times-circle"></span><span className="courseList">{"("+course.tutorialsection+"/"+course.labsection+")"}</span></p>;
        else
          return <p className="parent" key={course.coursename}>{course.coursenumber} <span onClick={this.remove.bind(this,course)} className="hiding fa fa-times-circle"></span><span className="courseList">{"("+course.section+"/"+course.tutorialsection+"/"+course.labsection+")"}</span></p>
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

    //if the state is not searching, don't show the previously populated section's array
    if(!this.state.searching){this.showSection=false}
  }
  handleChange() {
    //On enter we set the value of showing the sections to user to true
    this.showSection=true;

    //Making sure that the course name is in capital letters just like in the database
    var search_input = this.refs.myInput.value.toUpperCase();
    if(search_input != ""){
      this.setState({course_name: search_input});
      this.props.getSections(search_input).then((data) => {
        // reload props from reducer
        this.setState({display_sections: data});
      });
      this.refs.myInput.value=""
    }
  }
  handleForm()
  {
    this.props.getSections(this.state.course_name).then((data) => {
      // reload props from reducer
      this.setState({display_sections: data});
    });
  }

  addSection(e)
  {

    //var x = document.getElementById("MySelect")? document.getElementById("MySelect").value: null;
    var newSection=e.target.value.split(',')
    if(this.props.userCourses && this.props.userCourses.loaded && this.props.userCourses.courses)
    {
      // Make sure courseArray is empty if it hasn't been initialized yet instead of holding 'No Courses' value
      let courseArray = this.props.userCourses.courses[0] == 'No Courses'? [] : this.props.userCourses.courses;

      // Update the Firebase database by adding the nwe section to the user's CourseArray
      this.props.addUserSection(courseArray, this.state.course_name,{section:newSection[0], component:newSection[1], maxPat:newSection[2]});

    }
  }

  refresh() {
    window.location.reload()}

  render() {
    if (!this.props.currentUser ||(this.props.userCourses && !this.props.userCourses.courses) || !this.props.profState|| !this.props.notifications ) {
      return <Loadable
        active={true}
        spinner
        text='Loading...'
      >
      </Loadable>
    }
    return (
      <div>
        {this.renderName(this.props.currentUser)}
        <div className="welcomeHome fadeInHome">
          <div className="transBox ">
            <p>Here is the list of classes you are taking:</p>

            {this.getCourses()}
            {this.renderSearchBar()}<br/><br/>

            {this.renderSectionResult()}
          </div>
          <span> {this.btnAddTa()} </span>
          <div className="transbox">
            {this.addTa()}
          </div>

        </div>
      </div>

    );

  }

  renderName(currentUser)
  {
    if(currentUser && currentUser.uid)
      return <div className="welcomeHome white">Welcome {currentUser.displayName}!</div>
    return <div></div>
  }

  onkeyPress(e)
  {
    var self=this;
    if(e.key=="Enter" && this.refs.myInput)
    {
      e.preventDefault();
      this.handleChange()
    }

    return false;

  }

  renderSearchBar()
  {
    //If the user has clicked on add course, pull up the search bar. If not, show the add button.
    if(this.state.searching){
      return <a href="#">
        <form onKeyDown= {this.onkeyPress}><input type="search" value={this.state.value} ref="myInput" placeholder="Ex: COEN346" autoFocus/>
        </form>
        <span onClick={this.handleAdd} className="fa fa-minus-circle"></span></a>;
    }
    else
    {
      return <a href="#" onClick={this.handleAdd}><span className="fa fa-plus-circle">&nbsp;</span>Add Courses</a>
    }
  }
  renderSectionResult()
  {
    let sections_array = this.props.sections;
    let lec=[], tut=[], lab=[]

    if (this.state.searching && sections_array != undefined && this.showSection) {
      if (sections_array.length!=0) {
        sections_array.map((sec)=> {
          if (sec.component=='LEC') {
            lec.push(sec)
          }
          if (sec.component=='TUT') {
            tut.push(sec)
          }
          if (sec.component=='LAB') {
            lab.push(sec)
          }
        })
        let return_render = [],return_lec=[],return_tut=[],return_lab=[];
        return_render.push(<button className="btn btn-info btn-center3">{this.state.course_name}</button>)
        return_render.push(<label>&nbsp;&nbsp;<span className="fa fa-book colorIcon"> <label className="arial"> LEC:&nbsp;</label> </span></label>)
        return_lec.push(<option value="not picked" ></option>);
        for(let i = 0; i < lec.length; i++) {
          let sectionClick = this.addSection.bind(this,lec[i]);
          let classNames=lec[i].section + " btn btn-default";
          return_lec.push(<option value={lec[i].section + "," + lec[i].component+ "," + lec[i].maxPat} className={classNames}>{lec[i].section}</option>);
          //return_render.push(<button key={lec[i].section.toString()} onClick = {sectionClick} type="button" className={classNames}>{lec[i].section}</button>);
        }
        return_render.push(<select onChange={(e)=>{this.addSection(e)}}>{return_lec}</select>)

        if (tut.length!=0) {
          return_render.push(<label>&nbsp;&nbsp;<span className="fa fa-pencil-square-o colorIcon"> <label className="arial"> TUT:&nbsp;</label> </span></label>)
          return_tut.push(<option value="not picked" ></option>);
          for(let i = 0; i < tut.length; i++) {
            let sectionClick = this.addSection.bind(this,tut[i]);
            let classNames=tut[i].section + " btn btn-default";
            // return_render.push(<button key={tut[i].section.toString()} onClick = {sectionClick} type="button" className={classNames}>{tut[i].section}</button>);
            return_tut.push(<option value={tut[i].section + "," + tut[i].component+ "," + tut[i].maxPat}className={classNames}>{tut[i].section}</option>);
          }
          return_render.push(<select onChange={(e)=>{this.addSection(e)}}>{return_tut}</select>)
        }
        if (lab.length!=0) {
          return_lab.push(<option value="not picked" ></option>)
          return_render.push(<label>&nbsp;&nbsp;<span className="fa fa-desktop colorIcon"> <label className="arial"> LAB:&nbsp;</label> </span></label>)
          for(let i = 0; i < lab.length; i++) {
            let sectionClick = this.addSection.bind(this,lab[i]);
            let classNames=lab[i].section + " btn btn-default";
            return_lab.push(<option value={lab[i].section + "," + lab[i].component+ "," + lab[i].maxPat}className={classNames}>{lab[i].section}</option>);
          }
          return_render.push(<select onChange={(e)=>{this.addSection(e)}}>{return_lab}</select>)
        }
        return <div className="notCenter">{return_render}</div>;
      }
      else{
        return <div className= "alert alert-danger">{this.state.course_name} Does Not Exist.</div>
      }
    }
    return <div></div>;
  }

  renderTASections() {
    // if(this.props.profState && this.props.profState !=  'Not a professor') {
    let options = [];
    // TODO remove this crap
    let prof = this.props.profState;
    let i = 0;
    //THIS BREAKS CODE DOES INFINITE LOAD OF CLASSES
    options.push(<option value='-1'></option>)
    Object.keys(prof).map(function (key) {
      options.push(<option value={i} > {key}</option>)
      i++;
    });

    return <div>{options}</div>;

    //  }
  }
  btnAddTa(){
    if (this.props.profState !== 'Not a professor' && this.props.profState != null){

      return<button className=" btn btn-warning btn-round fa fa-plus-circle " id="btnTA" ref="btnTA" onClick={this.showAddTa}><span className="arial white"> ADD TA</span></button>
    }


  }
  showAddTa(){
    this.refs.btnTA.className="hideThis";
    this.refs.formTA.className="showThis";
  }

  hideAddTa(){
    this.refs.btnTA.className="showThis btn btn-warning btn-round fa fa-plus-circle spacing2";
    this.refs.formTA.className="hideThis";
  }
  addTa(){
    if (this.props.profState && this.props.profState!=="Not a professor") {
    return <form onKeyDown={this.submitInfo} onSubmit={this.submitButton} id="formTA" ref="formTA" className="hideThis">
      <span onClick={this.hideAddTa} className="fa fa-times-circle spacingTopRight hover"> </span>
      <div className="spacing"><input type="text" id="addTA" placeholder="example@gmail.com"/>
        <select id="TA">
          {this.renderTASections()}
        </select>
      </div>
      <div className="spacing"><input className="btn btn-round btn-info" type="submit" onClick={this.submitButton}/></div>
    </form>
    }
    return <div></div>
  }


  submitInfo(e){
    if(e.key=="Enter") {
      e.preventDefault();
      var email = document.getElementById("addTA").value;
      var sec = document.getElementById("TA");
      var section = sec.options[sec.selectedIndex].text;
      if(section && email){
        this.props.addTA(email,section)
      }
      swal("Added!", email+" has been added as a TA to "+section+".", "success", );
      document.getElementById("addTA").value="";
      document.getElementById("TA").value=""
    }
  }

  submitButton(e){
    e.preventDefault();
    var answer = document.getElementById("addTA");
    var hi = document.getElementById("TA");
    var strUser = hi.options[hi.selectedIndex].text;
    if(strUser){
      this.props.addTA(answer.value,strUser)
    }
    swal("Added!", answer.value+" has been added as a TA to "+strUser+".", "success", );
    document.getElementById("addTA").value="";
    document.getElementById("TA").value=""

  }


}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({ fetchUser, getUserCourses, getSections, addUserSection,deleteCourse, isProfessor,getNotifications, addTA, removeNotification}, dispatch);
}


function mapStateToProps(state) {
  return { currentUser: state.currentUser, userCourses: state.userCourses,sections:state.sections, profState: state.profState, notifications: state.notifications };
}


export default connect(mapStateToProps, mapDispatchToProps)(Index_home);


