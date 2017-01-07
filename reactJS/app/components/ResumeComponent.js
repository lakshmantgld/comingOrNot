import React, { Component } from 'react';
import { connect } from 'react-redux';

import getMuiTheme from 'material-ui/styles/getMuiTheme';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import resume from '../../resume.json';

import About from './About';
import Experience from './Experience';
import Skills from './Skills';
import Contact from './Contact';
import Education from './Education';
import Awards from './Awards';
import Projects from './Projects';

let styles = {
  robotofont: {
    fontFamily: 'roboto'
  }
};

const muiTheme = getMuiTheme({
  stepper: {
    iconColor: "black"
  },
  raisedButton: {
    primaryColor: "black",
  }
});




class ResumeComponent extends Component {
  render() {
    return (
      <MuiThemeProvider muiTheme={muiTheme}>
        <div className='fullPage'>
          <div className='row col-xs-offset-1 col-md-offset-2'>
            <div className='col-xs-12 col-md-10' style={{'paddingTop' : '37px'}}>
             <h1 className='robotoRegFont'>{resume.name}</h1>
             <h5 className='robotoLightFont' style={{'color' : '#797575','lineHeight' : '2'}}>{resume.address} &nbsp;&nbsp;|&nbsp;&nbsp;{resume.email} &nbsp;&nbsp;|&nbsp;{resume.mobile}</h5>
          <About abt={resume.about}/>
          <Skills skillSet={resume.skills}/>
          <Education education={resume.education}/>
          <Awards awards={resume.awards}/>
          <Projects projects={resume.projects}/>
          <Contact contact={resume.contacts}/>
          <Experience experience={resume.experience}/>
            </div>
          </div>
        </div>
      </MuiThemeProvider>
    );
  }
}

export default connect(state => ({}))(ResumeComponent);
