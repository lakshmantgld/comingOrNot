import React, { Component } from 'react';
import { connect } from 'react-redux';

import getMuiTheme from 'material-ui/styles/getMuiTheme';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import Footer from './Footer.js';
import Header from './Header';
var $ = require ('jquery');
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
  componentDidMount(){
  console.log("did mount");
  $.get("https://ipinfo.io", function(response) {
    const city = response.city;
    fetch('https://hooks.slack.com/services/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', {
    credentials: 'omit',
    method: 'POST',
    //body: JSON.stringify({'value' : value})})
    body: JSON.stringify({'text' : "Cheers ! someone viewed our App from " + city})})
     .then(res => {
       if (res.status !== 200) {
         let status = res.status;
         console.log('error in posting event');
       }
       console.log("succesfully saved");
       console.log(res.json());
     })
     .then(res =>{
       console.log(res);
     })
  }, "jsonp")

}

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
