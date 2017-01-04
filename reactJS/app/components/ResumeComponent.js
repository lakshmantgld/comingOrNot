import React, { Component } from 'react';
import { connect } from 'react-redux';

import getMuiTheme from 'material-ui/styles/getMuiTheme';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

let styles = {
  robotofont: {
    fontFamily: 'sans-serif'
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
          <h1> resume </h1>
        </div>
      </MuiThemeProvider>
    );
  }
}

export default connect(state => ({}))(ResumeComponent);
