import React, { PropTypes, Component } from 'react';
import { connect } from 'react-redux';

// import {  } from './../actions/registerActions';

let styles = {
  icon2: {
    marginRight: 10,
    marginTop: 14
  }
}

class Projects extends Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {

  }

  renderProjects(projects) {
    let renderedprojects = [];
    for (let i = 0; i < projects.length; i++){
      let projectsSet = [];
      projectsSet.push(<p className='projectName'>{projects[i]["name"]}</p>);
      if (projects[i]["role"] !== "") {
        projectsSet.push(<p className='projectRole'>{projects[i]["role"]}</p>);
      }
      projectsSet.push(<p className='projectDescription'>{projects[i]["description"]}</p>);
      renderedprojects.push(projectsSet);
      renderedprojects.push(<br />);
    }
    return renderedprojects;
  }

  render() {
    let currentURL = window.location.href;
    return (
      <div>
          <div className='row'>
              <div className='col-xs-12 col-md-2'>
                  <p className='sideHeading'>
                     projects
                  </p>
              </div>
              <div className='col-xs-12 col-md-10 sideContent'>
                  {this.renderProjects(this.props.projects)}
              </div>
          </div>
      </div>
    );
  }
  }


export default Projects;
