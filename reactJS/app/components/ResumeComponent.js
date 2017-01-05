import React, { Component } from 'react';
import { connect } from 'react-redux';

import getMuiTheme from 'material-ui/styles/getMuiTheme';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

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

let mainRow = {
    marginLeft: 100,
    marginTop: 20,
    paddingLeft: 120
}


class ResumeComponent extends Component {
  render() {
    return (
      <MuiThemeProvider muiTheme={muiTheme}>
        <div className='fullPage'>
          <div className='row' style={mainRow}>
            <div className='col-md-6'>
             <h1> Name Goes here .. </h1>
          <About />
          <Skills />
          <Education />
          <Awards />
          <Projects />
          <Contact />
          <Experience />
            </div>
          </div>
        </div>
      </MuiThemeProvider>
    );
  }
}

export default connect(state => ({}))(ResumeComponent);
