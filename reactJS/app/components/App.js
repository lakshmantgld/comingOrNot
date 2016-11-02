import React, { Component } from 'react';
import { connect } from 'react-redux';

import getMuiTheme from 'material-ui/styles/getMuiTheme';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import Footer from './Footer.js';
import Header from './Header';

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


class App extends Component {
  render() {
    return (
      <MuiThemeProvider muiTheme={muiTheme}>
        <div className='fullPage'>
          <Header />
          {this.props.children}
          <Footer />
        </div>
      </MuiThemeProvider>
    );
  }
}

export default connect(state => ({}))(App);
