import React, { PropTypes, Component } from 'react';
import { connect } from 'react-redux';

// import {  } from './../actions/registerActions';

let styles = {
  icon2: {
    marginRight: 10,
    marginTop: 14
  }
}

class About extends Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {

  }

  render() {
    let currentURL = window.location.href;
    return (
      <div>
        <div className='row'>
          <div className='col-xs-12 col-md-2'>
            <p className='sideHeading'> About </p>
          </div>
          <div className='col-xs-12 col-md-10'>
            <p className='contents'> {this.props.abt} </p>
          </div>
        </div>
      </div>
    );
  }
}

export default About;
