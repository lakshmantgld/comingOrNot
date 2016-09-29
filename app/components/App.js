import React, { Component } from 'react';
import { connect } from 'react-redux';

import getMuiTheme from 'material-ui/styles/getMuiTheme';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

import Header from './Header';

let styles = {
  robotofont: {
    fontFamily: 'sans-serif'
  }
};
class App extends Component {
  render() {
    return (
      <MuiThemeProvider muiTheme={getMuiTheme()}>
        <div style={styles.robotofont}>
          <Header />
          {this.props.children}
        </div>
      </MuiThemeProvider>
    );
  }
}

export default connect(state => ({}))(App);
