import React, {Component, PropTypes} from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';

import { grey100, grey600, red500, blue500 } from 'material-ui/styles/colors';
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

let dateStatus;

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
    fontSize: '25px',
    color: blue500
  },
  formLabel3: {
    text: 'bold',
    fontSize: '21.5px',
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
  icon2: {
    marginRight: 10
  },
  block: {
    maxWidth: 100,
    marginBottom: 16
  },
  block1: {
    maxWidth: 115,
    marginBottom: 16
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

  fillFreeStatus() {
    let dateStatusArray = this.props.eventObj.dateArray;
    dateStatus = {};
    dateStatus['free'] = {};
    dateStatus['maybe'] = {};
    dateStatus['busy'] = {};
    for (let i=0; i<dateStatusArray.length; i++) {
      dateStatus['free'][dateStatusArray[i]] = 0;
      dateStatus['maybe'][dateStatusArray[i]] = 0;
      dateStatus['busy'][dateStatusArray[i]] = 0;
    }

    for (let j=0; j<this.props.eventObj.attendees.length; j++) {
      let attendeesDateSelection = this.props.eventObj.attendees[j].personalizedDateSelection;
      for (let key in attendeesDateSelection) {
        if (attendeesDateSelection.hasOwnProperty(key)) {
          for (let dateStatuskey in dateStatus['free']) {
            if (dateStatus['free'].hasOwnProperty(dateStatuskey)) {
              if ((key === dateStatuskey) && (attendeesDateSelection[key] === 'free')) {
                dateStatus['free'][dateStatuskey] = dateStatus['free'][dateStatuskey] + 1;
              }
              if ((key === dateStatuskey) && (attendeesDateSelection[key] === 'maybe')) {
                dateStatus['maybe'][dateStatuskey] = dateStatus['maybe'][dateStatuskey] + 1;
              }
              if ((key === dateStatuskey) && (attendeesDateSelection[key] === 'busy')) {
                dateStatus['busy'][dateStatuskey] = dateStatus['busy'][dateStatuskey] + 1;
              }
            }
          }
        }
      }
    }

    let arrFree = Object.keys(dateStatus['free']).map(function (key) {return dateStatus['free'][key]});

    return (
      <Column
        header={<Cell>Free</Cell>}
        cell={props => (
          <Cell {...props}>
            {arrFree[props.rowIndex]}
          </Cell>
        )}
        width={100}
      />
    );
  }

  fillMaybeStatus() {
    let arrMaybe = Object.keys(dateStatus['maybe']).map(function (key) {return dateStatus['maybe'][key]});

    return (
      <Column
        header={<Cell>May be</Cell>}
        cell={props => (
          <Cell {...props}>
            {arrMaybe[props.rowIndex]}
          </Cell>
        )}
        width={100}
      />
    );

  }

  fillBusyStatus() {
    let arrBusy = Object.keys(dateStatus['busy']).map(function (key) {return dateStatus['busy'][key]});

    return (
      <Column
        header={<Cell>Busy</Cell>}
        cell={props => (
          <Cell {...props}>
            {arrBusy[props.rowIndex]}
          </Cell>
        )}
        width={100}
      />
    );

  }

  fillAttendeeDetails() {
    let attendees = this.props.eventObj.attendees;
    let dateArray = this.props.eventObj.dateArray;
    if (attendees.length !== 0) {
      let attendeesColumn = attendees.map((attendee, i) => {
        let orderedDateStausArray = [];
        dateArray.map((date, i) => {
          for (let key in attendee.personalizedDateSelection) {
            if (attendee.personalizedDateSelection.hasOwnProperty(key)) {
              if (date === key) {
                if (attendee.personalizedDateSelection[key] === 'free') {
                  orderedDateStausArray.push(<FontIcon className='material-icons' color={blue500} style={styles.icon2}>event_available</FontIcon>);
                }
                if (attendee.personalizedDateSelection[key] === 'maybe') {
                  orderedDateStausArray.push(<FontIcon className='material-icons' color={blue500} style={styles.icon2}>warning</FontIcon>);
                }
                if (attendee.personalizedDateSelection[key] === 'busy') {
                  orderedDateStausArray.push(<FontIcon className='material-icons' color={blue500} style={styles.icon2}>event_busy</FontIcon>);
                }
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
            width={100}
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
          <div className='col-xs-3'>
          </div>
          <div className='col-xs-offset-1 col-xs-2'>
            <label style={styles.dateLabel}> {date} </label>
          </div>
          <div className='col-xs'>
              <RadioButtonGroup name='shipSpeed' style={{ display: 'flex' }} onChange={this.handleDateToogle.bind(this, date)} defaultSelected='busy'>
                  <RadioButton
                    value='free'
                    label='Free'
                    checkedIcon={<FontIcon className='material-icons' color={red500} style={styles.icon}>event_available</FontIcon>}
                    uncheckedIcon={<FontIcon className='material-icons' style={styles.icon}>event_available</FontIcon>}
                    style={styles.block}
                  />
                  <RadioButton
                    value='maybe'
                    label='MayBe'
                    checkedIcon={<FontIcon className='material-icons' color={red500} style={styles.icon}>warning</FontIcon>}
                    uncheckedIcon={<FontIcon className='material-icons' style={styles.icon}>warning</FontIcon>}
                    style={styles.block1}
                  />
                  <RadioButton
                    value='busy'
                    label='Busy'
                    checkedIcon={<FontIcon className='material-icons' color={red500} style={styles.icon}>event_busy</FontIcon>}
                    uncheckedIcon={<FontIcon className='material-icons' style={styles.icon}>event_busy</FontIcon>}
                    style={styles.block}
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
        </div>
      );
    } else {
      let dateArray = this.props.eventObj.dateArray;

      result = (
        <div>
          <br />
          <div className='row center-xs'>
            <label style={styles.formLabel}> The Event Table </label>
          </div>
          <br />
          <div className='row'>
            <div className='col-xs-offset-2 col-xs-4'>
              <label style={styles.formLabel3}> No of people who entered the available dates: </label>
            </div>
            <div className='col-xs'>
              <label style={styles.formLabel2}> {this.props.eventObj.attendees.length} </label>
            </div>
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
                width={180}
              />
              {this.fillFreeStatus()}
              {this.fillMaybeStatus()}
              {this.fillBusyStatus()}
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
