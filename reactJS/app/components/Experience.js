import React, { PropTypes, Component } from 'react';
import { connect } from 'react-redux';

// import {  } from './../actions/registerActions';

let styles = {
  icon2: {
    marginRight: 10,
    marginTop: 14
  }
}

class Experience extends Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {

  }

  renderExperience(experience) {
    let renderedexperience = [];
    for (let i = 0; i < experience.length; i++){
      let experienceSet = [];
      experienceSet.push(<p className='awardName'>{experience[i]["position"]}</p>);
      experienceSet.push(<p className='awardOrganiser'>{experience[i]["organization"]}</p>);
      experienceSet.push(<p className='awardDate'>{experience[i]["location"]}</p>);
      experienceSet.push(<p className='awardDescription'>{experience[i]["year"]}</p>);
      experienceSet.push(<p className='awardDescription'>{experience[i]["description"]}</p>);
      renderedexperience.push(experienceSet);
      renderedexperience.push(<br />);
    }
    return renderedexperience;
  }

  render() {
    let currentURL = window.location.href;
    return (
      <div>
          <div className='row'>
              <div className='col-xs-12 col-md-2'>
                  <p className='sideHeading'>
                     experience
                  </p>
              </div>
              <div className='col-xs-12 col-md-10 sideContent'>
                  {this.renderExperience(this.props.experience)}
              </div>
          </div>
      </div>
    );
  }
  }

export default Experience;
