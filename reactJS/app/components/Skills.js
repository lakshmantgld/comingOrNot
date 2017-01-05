import React, { PropTypes, Component } from 'react';
import { connect } from 'react-redux';

// import {  } from './../actions/registerActions';

let styles = {
  icon2: {
    marginRight: 10,
    marginTop: 14
  }
}

class Skills extends Component {
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
          <div className='col-xs-12 col-md-3'>
            <p className='sideHeading'> Skills </p>
          </div>
          <div className='col-xs-12 col-md-9'>
            <p className='skill'>C++ • C • Java • Python • JavaScript • Ruby • C# • Objective-c • Python • CSS • LESS • PHP</p>
            <p className='skill'>NodeJS • AngularJS • ExpressJS • Apache Lucene • JQuery • React • MochaJS • ChaiJS • Django</p>
            <p className='skill'>MySQL • MongoDB • Postgres • MSSQL • Redis</p>
            <p className='skill'>Xcode • Android Studio • Git • IntelliJ • MSSQL Server • AWS • Heroku</p>
            <p className='skill'>Project Management • UX • Keynote • Framer</p>
          </div>
        </div>
      </div>
    );
  }
}

Skills.propTypes = {
};

export default connect(state =>({
}))(Skills);
