import React, {Component, PropTypes} from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';

import { grey100, grey600, red500 } from 'material-ui/styles/colors';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton'
import TimePicker from 'material-ui/TimePicker';
import Chip from 'material-ui/Chip';
import Paper from 'material-ui/Paper';
import Divider from 'material-ui/Divider';
import IconButton from 'material-ui/IconButton';
import FontIcon from 'material-ui/FontIcon';

import Table from 'fixed-data-table';
import CopyToClipboard from 'react-copy-to-clipboard';

let styles = {
  formTab: {
    paddingBottom: '16px'
  },
  formGroup: {
    margin: '16px',
    padding: '16px'
  },
  formItem: {
    margin: '16px'
  },
  formLabel: {
    text: 'bold',
    fontSize: '25px',
    color: grey600
  },
  formLabel2: {
    text: 'bold',
    fontSize: '20px',
    color: grey600
  },
  errorLabel: {
    text: 'bold',
    fontSize: '22px',
    color: red500
  },
  chip: {
    margin: 4,
  },
  wrapper: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  textField: {
    marginLeft: 20
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

  getEventPageUrl() {
    const eventId = this.props.params.eventId;
    const eventURL = 'https://letsmeetupp.herokuapp.com/event/eventId=' + eventId;

    return eventURL;
  }

  render() {
    let eventId = this.props.params.eventId;
    let eventShareURL = 'https://letsmeetupp.herokuapp.com/event/eventId=' + eventId;

    return (
      <div>
      <br />
        <div className='row center-xs'>
          <label style={styles.formLabel}> Share the Event Url with your friends, for choosing the best possible date</label>
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
            <RaisedButton label="Event Page" primary={true} style={buttonStyle} disabled={false} />
          </Link>
        </div>
      </div>
    );
  }
}

EventShareComponent.propTypes = {
};

export default connect(state => ({
}))(EventShareComponent);
