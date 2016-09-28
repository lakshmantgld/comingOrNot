import React, {Component, PropTypes} from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';

import { grey600, red500 } from 'material-ui/styles/colors';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton'
import Paper from 'material-ui/Paper';
import Divider from 'material-ui/Divider';
import IconButton from 'material-ui/IconButton';
import FontIcon from 'material-ui/FontIcon';

import CopyToClipboard from 'react-copy-to-clipboard';

let styles = {
  formLabel: {
    text: 'bold',
    fontSize: '25px',
    color: grey600
  },
  paperStyle: {
    width: '50%'
  },
  icon: {
   marginRight: 24,
  }
};

let buttonStyle = {
  margin : 12
};

class EventShareComponent extends Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
  }

// An Href link to eventPage form eventShare.
  getEventPageUrl() {
    const eventId = this.props.params.eventId;
    const eventURL = 'https://letsmeetupp.herokuapp.com/event/eventId=' + eventId;

    return eventURL;
  }

// starting point of this component.
  render() {
    let eventId = this.props.params.eventId;
    let eventShareURL = window.location.origin + '/event/eventId=' + eventId;

    return (
      <div>
      <br />
        <div className='row center-xs'>
          <label style={styles.formLabel}> {this.props.languageJson.shareLabel} </label>
        </div>
        <br />
        <br />
        <div className='row center-xs'>
          <Paper style={styles.paperStyle} depth={10}>
            <TextField
              id='shareUrl'
              underlineShow={false}
              value={eventShareURL}
              fullWidth={true}
            />
            <Divider />
          </Paper>
          <CopyToClipboard text={eventShareURL}>
            <IconButton tooltip="Copy URL">
              <FontIcon className="material-icons" style={styles.icon}>content_copy</FontIcon>
            </IconButton>
          </CopyToClipboard>
        </div>
        <br />
        <br />
        <div className='row center-xs'>
          <Link to={this.getEventPageUrl()}>
            <RaisedButton label={this.props.languageJson.eventPageButton} primary={true} style={buttonStyle} disabled={false} />
          </Link>
        </div>
      </div>
    );
  }
}

EventShareComponent.propTypes = {
  languageJson: PropTypes.object.isRequired
};

export default connect(state => ({
  languageJson: state.languageJson
}))(EventShareComponent);
