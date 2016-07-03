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
import {RadioButton, RadioButtonGroup} from 'material-ui/RadioButton';
import ActionFavorite from 'material-ui/svg-icons/action/favorite';
import ActionFavoriteBorder from 'material-ui/svg-icons/action/favorite-border';

import {Table, Column, Cell} from 'fixed-data-table';
import CopyToClipboard from 'react-copy-to-clipboard';

import { fetchEvent, storePersonalizedDateSelection, storeAttendeeName, storeAttendeeNameErrorLabel,
         updateEvent  } from './../actions/registerActions';

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
  dateLabel: {
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
    marginRight: 24
  },
  block: {
    maxWidth: 250,
  },
  radioButton: {
    marginBottom: 16,
  }
};

let buttonStyle = {
  margin : 12
};

class EventPageComponent extends Component {
  constructor(props) {
    super(props);
    this.handleDateToogle = this.handleDateToogle.bind(this);
    this.storeAttendeeName = this.storeAttendeeName.bind(this);
    this.updateEvent = this.updateEvent.bind(this);
  }

  componentDidMount() {
    this.props.dispatch(fetchEvent(this.props.params.eventId));
  }

  handleDateToogle(date, e) {
    this.props.dispatch(storePersonalizedDateSelection(date, e.target.value));
  }

  storeAttendeeName(e) {
    if (e.target.value.length >= '40') {
      this.props.dispatch(storeAttendeeNameErrorLabel('Only 40 characters permitted!!!'))
    } else {
      this.props.dispatch(storeAttendeeNameErrorLabel(''))
      this.props.dispatch(storeAttendeeName(e.target.value));
    }
  }

  fillTheLeftOutDates() {
    let count = 0;
    this.props.eventObj.dateArray.map((date, i) => {
      for (let key in this.props.personalizedDateSelection) {
        if (this.props.personalizedDateSelection.hasOwnProperty(key)) {
          if (date === key ) {
            count = 1;
          }
        }
      }
      if (count === 0) {
        this.props.dispatch(storePersonalizedDateSelection(date, 'busy'));
      }
      count = 0;
    });
  }

  callAfterSomeTime() {
    this.props.dispatch(updateEvent(this.props.attendeeName, this.props.personalizedDateSelection, this.props.eventObj._id));
  }

  updateEvent(e) {
    // populating personalizedDateSelection if user has not chosen any status.
    if (this.props.attendeeName.length === 0) {
      this.props.dispatch(storeAttendeeNameErrorLabel('Name field is required!!'));
    } else {
      this.fillTheLeftOutDates();
      setTimeout((function() {
       this.callAfterSomeTime();
     }).bind(this), 1000);
    }
  }


  fillAttendeeDetails() {
    console.log('in fillAttendeeDetails');
    let attendees = this.props.eventObj.attendees;
    let dateArray = this.props.eventObj.dateArray;
    if (attendees.length !== 0) {
      let attendeesColumn = attendees.map((attendee, i) => {
        console.log('in attendee map');
        let orderedDateStausArray = [];
        dateArray.map((date, i) => {
          for (let key in attendee.personalizedDateSelection) {
            if (attendee.personalizedDateSelection.hasOwnProperty(key)) {
              if (date === key) {
                orderedDateStausArray.push(attendee.personalizedDateSelection[key]);
              }
            }
          }
        });
        return (
          <Column
            header={<Cell>{attendee.attendeeName}</Cell>}
            cell={props => (
              <Cell {...props}>
                {orderedDateStausArray[props.rowIndex]}
              </Cell>
            )}
            width={200}
          />
        );
      });
      return attendeesColumn;
    } else {
      return null;
    }
  }

  dateToggleSection() {
    let dateArray = this.props.eventObj.dateArray;
    return dateArray.map((date, i) =>{
      return (
        <div className='row'>
          <div className='col-xs-offset-4 col-xs-2'>
            <label style={styles.dateLabel}> {date} </label>
          </div>
          <div className='col-xs'>
            <br />
            <RadioButtonGroup name="shipSpeed" onChange={this.handleDateToogle.bind(this, date)} defaultSelected="busy">
                <RadioButton
                  value="free"
                  label=""
                  checkedIcon={<FontIcon className="material-icons" color={red500} style={styles.icon}>event_available</FontIcon>}
                  uncheckedIcon={<FontIcon className="material-icons" style={styles.icon}>event_available</FontIcon>}
                  style={styles.radioButton}
                />
                <RadioButton
                  value="maybe"
                  label=""
                  checkedIcon={<FontIcon className="material-icons" color={red500} style={styles.icon}>warning</FontIcon>}
                  uncheckedIcon={<FontIcon className="material-icons" style={styles.icon}>warning</FontIcon>}
                  style={styles.radioButton}
                />
                <RadioButton
                  value="busy"
                  label=""
                  checkedIcon={<FontIcon className="material-icons" color={red500} style={styles.icon}>event_busy</FontIcon>}
                  uncheckedIcon={<FontIcon className="material-icons" style={styles.icon}>event_busy</FontIcon>}
                  style={styles.radioButton}
                />
            </RadioButtonGroup>
          </div>
        </div>
      );
    });
  }

  render() {

    let result;

    if (Object.keys(this.props.eventObj).length === 0 && this.props.eventObj.constructor === Object) {
      result = (
        <div>
          <h1> Object empty </h1>
        </div>
      );
    } else {
      let dateArray = this.props.eventObj.dateArray;

      result = (
        <div>
          <div className='row center-xs'>
            <label style={styles.formLabel}> The Event Table </label>
          </div>
          <br />
          <div className='row center-xs'>
            <Table
              rowsCount={dateArray.length}
              rowHeight={50}
              width={800}
              height={50 * (dateArray.length + 1)}
              headerHeight={50}
            >
              <Column
                header={<Cell>Dates</Cell>}
                cell={props => (
                  <Cell {...props}>
                    {dateArray[props.rowIndex]}
                  </Cell>
                )}
                fixed={true}
                width={200}
              />
              <Column
                header={<Cell>Free</Cell>}
                cell={<cell>Free</cell>}
                width={200}
              />
              <Column
                header={<Cell>May be</Cell>}
                cell={<cell>May be</cell>}
                width={200}
              />
              <Column
                header={<Cell>Busy</Cell>}
                cell={<cell>Busy</cell>}
                width={200}
              />
              {this.fillAttendeeDetails()}
            </Table>
          </div>
          <br />
          <div className='row center-xs'>
            <label style={styles.formLabel}> Enter youe convenient Dates </label>
          </div>
          <br />
          <div className='row'>
            <div className='col-xs-offset-5 col-xs-1'>
              <label style={styles.formLabel}> Name </label>
            </div>
            <div className='col-xs'>
              <TextField id='name' hintText='Name' onChange={this.storeAttendeeName} value={this.props.attendeeName} />
              <br />
              <label style={styles.errorLabel}> {this.props.attendeeNameErrorLabel} </label>
            </div>
          </div>
          <br />
          {this.dateToggleSection()}
          <br />
          <div className='row center-xs'>
            <RaisedButton label="Update" primary={true} style={buttonStyle} disabled={false} onTouchTap={this.updateEvent} />
          </div>
        </div>
      );
    }
    return result;
  }
}

EventPageComponent.propTypes = {
  eventObj: PropTypes.object.isRequired,
  attendeeName: PropTypes.string.isRequired,
  attendeeNameErrorLabel: PropTypes.string.isRequired,
  personalizedDateSelection: PropTypes.object.isRequired
};

export default connect(state => ({
  eventObj: state.eventObj,
  attendeeName: state.attendeeName,
  attendeeNameErrorLabel: state.attendeeNameErrorLabel,
  personalizedDateSelection: state.personalizedDateSelection
}))(EventPageComponent);
