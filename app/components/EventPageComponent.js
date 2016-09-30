import React, {Component, PropTypes} from 'react';
import { connect } from 'react-redux';
import cookie from 'react-cookie';
import { grey600, red500, red200, blue500, green500, green200, yellow800, yellow200} from 'material-ui/styles/colors';
import Avatar from 'material-ui/Avatar';
import Chip from 'material-ui/Chip';
import Snackbar from 'material-ui/Snackbar';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';
import FontIcon from 'material-ui/FontIcon';
import {RadioButton, RadioButtonGroup} from 'material-ui/RadioButton';
import {Table, Column, Cell} from 'fixed-data-table-2';
import MediaQuery from 'react-responsive';
import ResponsiveFixedDataTable from 'responsive-fixed-data-table';
import {Card, CardActions, CardHeader, CardText} from 'material-ui/Card';

import { fetchEvent, storePersonalizedDateSelection, storeAttendeeName, storeAttendeeNameErrorLabel,
         updateEvent, toggleCastAttendance, attendeeNameEmptyFlag, attendeeNameExistsFlag, emptyPersonalizedDateSelection, storeUpdateAttendeeId, storeUpdateAttendeeName,
         storeUpdateAttendeeDate, updateAttendee } from './../actions/registerActions';

let dateStatus;

let styles = {
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
    fontSize: '25px',
    color: grey600
  },
  errorLabel: {
    fontSize: '15px',
    color: 'rgba(244, 67, 54, 0.79)'
  },
  paperStyle: {
    width: '50%'
  },
  icon: {
    marginRight: 24
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
  },
  chip: {
   margin: 4,
 },
  chipwrapper: {
   display: 'flex',
   flexWrap: 'wrap',
 }
};

let buttonStyle = {
  margin : 12
};


class EventPageComponent extends Component {

// The methods in the constructor are given to bind the function to redux's state object.
  constructor(props) {
    super(props);
    this.CountStatus = this.CountStatus.bind(this);
    this.handleDateToogle = this.handleDateToogle.bind(this);
    this.handleRequestClose_NameEmpty = this.handleRequestClose_NameEmpty.bind(this);
    this.handleRequestClose_NameExists = this.handleRequestClose_NameExists.bind(this);
    this.storeAttendeeName = this.storeAttendeeName.bind(this);
    this.updateEvent = this.updateEvent.bind(this);
    this.toggleCastAttendance = this.toggleCastAttendance.bind(this);
    this.toggleMobileCastAttendance = this.toggleMobileCastAttendance.bind(this);
    this.toggleCastAttendanceButton = this.toggleCastAttendanceButton.bind(this);
    this.updateAttendeeComponent = this.updateAttendeeComponent.bind(this);
    this.updateAttendee = this.updateAttendee.bind(this);
  }

// The below method gets executed after all the components have been successfully rendered on the screen.
  componentDidMount() {
    this.props.dispatch(fetchEvent(this.props.params.eventId));
    if (document.cookie.indexOf(this.props.params.eventId) > -1) //If cookie got current event ID.. Directly add his name as update attendee name
    {
    this.props.dispatch(storeAttendeeName(cookie.load(this.props.params.eventId)));//later we need to add the latest name
    }
  }

// Store the selected date to the state object.
// dispatch is the one that invokes the action creators.
  handleDateToogle(date, e) {
    this.props.dispatch(storePersonalizedDateSelection(date, e.target.value));
  }

  callAfterSomeTimeUpdateAttendee() {
    this.props.dispatch(updateAttendee(this.props.updateAttendeeId, this.props.attendeeName, this.props.personalizedDateSelection, this.props.params.eventId));
    cookie.save(this.props.params.eventId, this.props.attendeeName); // Save name in cookie event ID
    this.props.dispatch(storeUpdateAttendeeName(''));
    this.props.dispatch(storeUpdateAttendeeId(''));
    this.toggleCastAttendanceButton();
    this.props.dispatch(storeAttendeeName(''));
  }

  fillTheLeftOutDatesAttendee() {
    let count = 0;
    for (let date in this.props.updateAttendeeDate) {
      if (this.props.updateAttendeeDate.hasOwnProperty(date)) {
        for (let key in this.props.personalizedDateSelection) {
          if (this.props.personalizedDateSelection.hasOwnProperty(key)) {
            if (date === key ) {
              count = 1;
            }
          }
        }
        if (count === 0) {
          this.props.dispatch(storePersonalizedDateSelection(date, this.props.updateAttendeeDate[date]));
        }
        count = 0;
      }
    }
  }

  updateAttendee() {
    if (this.props.attendeeName.length === 0) {
      this.props.dispatch(storeAttendeeNameErrorLabel(this.props.languageJson.attendeeNameErrorLabel));
    } else if (this.duplicateCheck()) {
      this.props.dispatch(storeAttendeeNameErrorLabel(this.props.languageJson.attendeeNameErrorLabelDuplicate));
    } else {
      // populating personalizedDateSelection if user has not chosen any status.
      this.fillTheLeftOutDatesAttendee();
      // A timeout has been used, because There will be a little time taken for storing the default values
      // to the left-out dates. So, having a delay will give a consistency in the application.
      setTimeout((function() {
       this.callAfterSomeTimeUpdateAttendee();
     }).bind(this), 1000);
    }
  }

  updateAttendeeComponent(id, name, date, e){
    this.props.dispatch(storeUpdateAttendeeName(name));
    this.props.dispatch(storeUpdateAttendeeId(id));
    this.props.dispatch(storeUpdateAttendeeDate(date));
    this.props.dispatch(storeAttendeeName(name));
    this.toggleCastAttendanceButton();
  }

// Will store attendeeName and invoke error action in case of failed edge case.
  storeAttendeeName(e) {
    if (e.target.value.length >= '40') {
      this.props.dispatch(storeAttendeeNameErrorLabel(this.props.languageJson.attendeeNameErrorLabel))
    } else {
      this.props.dispatch(storeAttendeeNameErrorLabel(''));
      this.props.dispatch(storeAttendeeName(e.target.value));
    }
  }

// This is an helper function to store the dates that have not been selected by the user.
// for instance, there are six dates, and the user selects the status(free, maybe, busy) for the four and
// leaves the remaining dates, then the below method will give default values to the unselected dates by the user.
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

// This cast by attendess will be invoked after an secod for providing delay.
  callAfterSomeTimeUpdate() {
    cookie.save(this.props.params.eventId, this.props.attendeeName); // Save name in cookie event ID
    this.props.dispatch(updateEvent(this.props.attendeeName, this.props.personalizedDateSelection, this.props.eventObj._id)); // Update in DB
    this.props.dispatch(toggleCastAttendance(false)); // Show Cast attendance button instead f date toggle selection
    this.props.dispatch(emptyPersonalizedDateSelection()); // Clear all the status entered by the user
  }

  duplicateCheck() {
    let count = 0;
    let i = 0;
    for (i = 0; i < this.props.eventObj.attendees.length; i++) {
      if (this.props.attendeeName === this.props.eventObj.attendees[i].attendeeName) {
        count = 1;
      }
    }

    if (count === 1) {
      return true;
    } else {
      return false;
    }
    count = 0;
  }

// stores the attendess selection of dates and his name.
  updateEvent(e) {
    if (this.props.attendeeName.length === 0) {
      this.props.dispatch(storeAttendeeNameErrorLabel(this.props.languageJson.attendeeNameErrorLabel));
      this.props.dispatch(attendeeNameEmptyFlag(true)); //If name is empty, bring snackbar
    } else if (this.duplicateCheck()) {
      this.props.dispatch(storeAttendeeNameErrorLabel(this.props.languageJson.attendeeNameErrorLabelDuplicate));
      this.props.dispatch(attendeeNameExistsFlag(true)); //If name is duplicate entry, bring snackbar
    } else {
      // populating personalizedDateSelection if user has not chosen any status.
      this.fillTheLeftOutDates();

      // A timeout has been used, because There will be a little time taken for storing the default values
      // to the left-out dates. So, having a delay will give a consistency in the application.
      setTimeout((function() {
       this.callAfterSomeTimeUpdate();
     }).bind(this), 1000);
    }
  }

// This method is responsible for calculating the count of free, maybe and busy for a given date.
  CountStatus() {

    let dateStatusArray = this.props.eventObj.dateArray;
    dateStatus = {};
    dateStatus['free'] = {};
    dateStatus['maybe'] = {};
    dateStatus['busy'] = {};
    for (let i = 0; i < dateStatusArray.length; i++) {
        dateStatus['free'][dateStatusArray[i]] = 0;
        dateStatus['maybe'][dateStatusArray[i]] = 0;
        dateStatus['busy'][dateStatusArray[i]] = 0;
    }

    for (let j = 0; j < this.props.eventObj.attendees.length; j++) {
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
  }

  fillFreeStatus() { // Generate column to list free status count for each date

    this.CountStatus(); // Count status for each date and stores in dateStatus array

    let arrFree = Object.keys(dateStatus['free']).map(function (key) {return dateStatus['free'][key]});

    return (
      <Column
        header={<Cell>Free</Cell>}
        cell={props => (
          <Cell {...props}>
            {arrFree[props.rowIndex]}
          </Cell>
        )}
        width={80}
      />
    );
  }

  fillMaybeStatus() { // Generate column to list maybe status count for each date

    let arrMaybe = Object.keys(dateStatus['maybe']).map(function (key) {return dateStatus['maybe'][key]});

    return (
      <Column
        header={<Cell>May be</Cell>}
        cell={props => (
          <Cell {...props}>
            {arrMaybe[props.rowIndex]}
          </Cell>
        )}
        width={80}
      />
    );

  }

  fillBusyStatus() { // Generate column to list maybe status count for each date

    let arrBusy = Object.keys(dateStatus['busy']).map(function (key) {return dateStatus['busy'][key]});

    return (
      <Column
        header={<Cell>Busy</Cell>}
        cell={props => (
          <Cell {...props}>
            {arrBusy[props.rowIndex]}
          </Cell>
        )}
        width={80}
      />
    );

  }

  // Fills the attendess selection in the event table.
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
                  orderedDateStausArray.push(<FontIcon className='material-icons' color={green500}>panorama_fish_eye</FontIcon>);
                }
                if (attendee.personalizedDateSelection[key] === 'maybe') {
                  orderedDateStausArray.push(<FontIcon className='material-icons' color={yellow800}>change_history</FontIcon>);
                }
                if (attendee.personalizedDateSelection[key] === 'busy') {
                  orderedDateStausArray.push(<FontIcon className='material-icons' color={red500}>clear</FontIcon>);
                }
              }
            }
          }
        });
        return (
          <Column
            header={<Cell onTouchTap={this.updateAttendeeComponent.bind(this, attendee._id, attendee.attendeeName, attendee.personalizedDateSelection)}>{attendee.attendeeName}</Cell>}
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

// Renders the date for the event for user selection.
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
                    checkedIcon={<FontIcon className='material-icons' color={red500} style={styles.icon}>panorama_fish_eye</FontIcon>}
                    uncheckedIcon={<FontIcon className='material-icons' style={styles.icon}>panorama_fish_eye</FontIcon>}
                    style={styles.block}
                  />
                  <RadioButton
                    value='maybe'
                    label='MayBe'
                    checkedIcon={<FontIcon className='material-icons' color={red500} style={styles.icon}>change_history</FontIcon>}
                    uncheckedIcon={<FontIcon className='material-icons' style={styles.icon}>change_history</FontIcon>}
                    style={styles.block1}
                  />
                  <RadioButton
                    value='busy'
                    label='Busy'
                    checkedIcon={<FontIcon className='material-icons' color={red500} style={styles.icon}>clear</FontIcon>}
                    uncheckedIcon={<FontIcon className='material-icons' style={styles.icon}>clear</FontIcon>}
                    style={styles.block}
                  />
              </RadioButtonGroup>
          </div>
        </div>
      );
    });
  }

// Generate Chips based on status and list
  MobileAttendeeChips(status,list) {

   switch (status) {
    case "free":
        return list.map((name, k) => {
            return (
                <Chip backgroundColor={green200} style={styles.chip}><Avatar backgroundColor={green500} icon={< FontIcon className = "material-icons" > panorama_fish_eye < /FontIcon>}/>{name}</Chip>
            );
        });
        break;
    case "maybe":
        return list.map((name, k) => {
            return (
                <Chip backgroundColor={yellow200} style={styles.chip}><Avatar backgroundColor={yellow800} icon={< FontIcon className = "material-icons" > change_history < /FontIcon>}/>{name}</Chip>
            );
        });
        break;
    case "busy":
        return list.map((name, k) => {
            return (
                <Chip backgroundColor={red200} style={styles.chip}><Avatar backgroundColor={red500} icon={< FontIcon className = "material-icons" > clear < /FontIcon>}/>{name}</Chip>
            );
        });
        break;
   }

  }

// Generate mobile toggle buttons
  MobileToggleButtons(date){
   return (
    <div>
        <MediaQuery minDeviceWidth={420}>
            {/** Tablets and phablets: display label for radio buttons*/}
            <RadioButtonGroup name='shipSpeed' className='row' onChange={this.handleDateToogle.bind(this, date)} defaultSelected='busy'>

                <RadioButton className='col-xs-4' style={{}} value='free' label='Free' checkedIcon={< FontIcon className = 'material-icons' color = {
                    green500
                }
                style = {
                    styles.icon
                } > panorama_fish_eye < /FontIcon>} uncheckedIcon={< FontIcon className = 'material-icons' style = {
                    styles.icon
                } > panorama_fish_eye < /FontIcon>}/>

                <RadioButton className='col-xs-4' style={{}} value='maybe' label='Maybe' checkedIcon={< FontIcon className = 'material-icons' color = {
                    yellow800
                }
                style = {
                    styles.icon
                } > change_history < /FontIcon>} uncheckedIcon={< FontIcon className = 'material-icons' style = {
                    styles.icon
                } > change_history < /FontIcon>}/>

                <RadioButton className='col-xs-4' style={{}} value='busy' label='Busy' checkedIcon={< FontIcon className = 'material-icons' color = {
                    red500
                }
                style = {
                    styles.icon
                } > clear < /FontIcon>} uncheckedIcon={< FontIcon className = 'material-icons' style = {
                    styles.icon
                } > clear < /FontIcon>}/>

            </RadioButtonGroup>
        </MediaQuery>

        <MediaQuery maxDeviceWidth={420}>
            {/** Smartphones */}
            <RadioButtonGroup name='shipSpeed' className='row' onChange={this.handleDateToogle.bind(this, date)} defaultSelected='busy'>

                <RadioButton className='col-xs-4' style={{}} value='free' checkedIcon={< FontIcon className = 'material-icons' color = {
                    green500
                }
                style = {
                    styles.icon
                } > panorama_fish_eye < /FontIcon>} uncheckedIcon={< FontIcon className = 'material-icons' style = {
                    styles.icon
                } > panorama_fish_eye < /FontIcon>}/>

                <RadioButton className='col-xs-4' style={{}} value='maybe' checkedIcon={< FontIcon className = 'material-icons' color = {
                    yellow800
                }
                style = {
                    styles.icon
                } > change_history < /FontIcon>} uncheckedIcon={< FontIcon className = 'material-icons' style = {
                    styles.icon
                } > change_history < /FontIcon>}/>

                <RadioButton className='col-xs-4' style={{}} value='busy' checkedIcon={< FontIcon className = 'material-icons' color = {
                    red500
                }
                style = {
                    styles.icon
                } > clear < /FontIcon>} uncheckedIcon={< FontIcon className = 'material-icons' style = {
                    styles.icon
                } > clear < /FontIcon>}/>

            </RadioButtonGroup>
        </MediaQuery>
    </div>);
  }

  MobiledateToggleSection() {
    let dateArray = this.props.eventObj.dateArray; //  Get date list
    let attendees = this.props.eventObj.attendees; //  Get attendees list

    return dateArray.map((date, i) =>{ // for each date create a card
    let freelist = [], maybelist = [], busylist = [];
      attendees.map((attendee, j) => { // for each attendee check status for the given date
        for (let key in attendee.personalizedDateSelection) {
          if (attendee.personalizedDateSelection.hasOwnProperty(key)) {
            if (date === key) {

              if (attendee.personalizedDateSelection[key] === 'free') {
              freelist.push(attendee.attendeeName); // If attendee is free, push in freelist array
              }
              if (attendee.personalizedDateSelection[key] === 'maybe') {
              maybelist.push(attendee.attendeeName);
              }
              if (attendee.personalizedDateSelection[key] === 'busy') {
              busylist.push(attendee.attendeeName);
              }
            }
          }
        }
      });

      return (


    <div className = 'row center-xs'>
    <div className='col-sm-8 col-xs-12'>
    <Card expandable={true}>
      <CardHeader
          style={{paddingLeft:"90px"}}
          title={date}
          actAsExpander={true}
          showExpandableButton={true}
          />
          <CardText expandable={true}>
            <div style={styles.chipwrapper}>{this.MobileAttendeeChips("free",freelist)}{this.MobileAttendeeChips("maybe",maybelist)}{this.MobileAttendeeChips("busy",busylist)}</div>
          </CardText>
        <CardActions>
            <div className='row center-xs'>
              <br></br>
              <br></br>
                <div className='col-xs-12'>

                {this.MobileToggleButtons(date)}

                </div>
            </div>
        </CardActions>
    </Card>
    <br></br>
    </div>
    </div>

      );
    });
  }

  toggleCastAttendanceButton() {
    if (this.props.toggleCastAttendance) {
      this.props.dispatch(toggleCastAttendance(false));
    } else {
      this.props.dispatch(toggleCastAttendance(true));
    }
  }

  updateDateToggleSection() {
    let updateDateCollection = [];
    let i = 0;
    for (let key in this.props.updateAttendeeDate) {
      if (this.props.updateAttendeeDate.hasOwnProperty(key)) {
          updateDateCollection[i++] = (
            <div className='row'>
              <div className='col-xs-3'>
              </div>
              <div className='col-xs-offset-1 col-xs-2'>
                <label style={styles.dateLabel}> {key} </label>
              </div>
              <div className='col-xs'>
                  <RadioButtonGroup name='shipSpeed' style={{ display: 'flex' }} onChange={this.handleDateToogle.bind(this, key)} defaultSelected={this.props.updateAttendeeDate[key]}>
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
        } // if
      } // for
      return updateDateCollection;
  }

  toggleCastAttendance() {
    if (this.props.toggleCastAttendance) {
      console.log("toggle cast attendance flag: true");
      if (this.props.updateAttendeeName !== '' && this.props.updateAttendeeId !== '') { {/** fails for first time event page visitor */}
        console.log("Clicked attendee name");
        if (document.cookie.indexOf(this.props.params.eventId) > -1 && cookie.load(this.props.params.eventId) === this.props.updateAttendeeName ) {
          console.log("Attendee name matches with cookie");
          return (
            <div>
              <div className='row center-xs'>
                <label style={styles.formLabel}> {this.props.languageJson.dateSelectionLabel} </label>
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
              {this.updateDateToggleSection()}
              <br />
              <div className='row center-xs'>
                <RaisedButton label='Update' primary={true} style={buttonStyle} disabled={false} onTouchTap={this.updateAttendee} />
              </div>
            </div>
          );
        } else {
          return (
            <div>
              <br />
              <div className='row center-xs'>
                <label style={styles.formLabel}> {this.props.languageJson.dateCastSelectionLabel} </label>
              </div>
              <br />
              <div className='row center-xs'>
                <RaisedButton label='Cast Attendance' primary={true} style={buttonStyle} disabled={false} onTouchTap={this.toggleCastAttendanceButton} />
              </div>
            </div>
          );
        }
      } else { {/** First time event page visitor - Default date toggle (All busy) */}
        return (
          <div>
            <div className='row center-xs'>
              <label style={styles.formLabel}> {this.props.languageJson.dateSelectionLabel} </label>
            </div>
            <br />
            <div className='row'>
              <div className='col-xs-offset-5 col-xs-1'>
                <label style={styles.formLabel}> Name </label>
              </div>
              <div className='col-xs'>
                <TextField id='name' hintText='Name' onChange={this.storeAttendeeName} value={this.props.attendeeName} />{/** First time event page visitor - Name Input box */}
                <br />
                <label style={styles.errorLabel}> {this.props.attendeeNameErrorLabel} </label>
              </div>
            </div>
            <br />
            {this.dateToggleSection()}
            <br />
            <div className='row center-xs'>
              <RaisedButton label='Update' primary={true} style={buttonStyle} disabled={false} onTouchTap={this.updateEvent} />
            </div>
          </div>
        );
      }
    } else { {/** First time event page visitor - Cast Attendance Button */}
      return (
        <div>
          <br />
          <div className='row center-xs'>
            <label style={styles.formLabel}> {this.props.languageJson.dateCastSelectionLabel} </label>
          </div>
          <br />
          <div className='row center-xs'>
            <RaisedButton label='Cast Attendance' primary={true} style={buttonStyle} disabled={false} onTouchTap={this.toggleCastAttendanceButton} />
          </div>
        </div>
      );
    }
  }

  toggleMobileCastAttendance() {
      if (document.cookie.indexOf(this.props.params.eventId) == -1) { //Cookie not found? display virgin page
          return (
              <div>
                <div className='row center-xs'>
                  <div className='col-xs-10'>
                    <TextField id='name' hintText='Name' onChange={this.storeAttendeeName} value={this.props.attendeeName} />
                    <br />
                    <label style={styles.errorLabel}> {this.props.attendeeNameErrorLabel} </label>
                  </div>
                </div>
                <br></br>
                <br></br>
                  <div>{this.MobiledateToggleSection()}</div>
                    <br />
                    <div className='row center-xs'>
                      <RaisedButton label='Register' primary={true} style={buttonStyle} disabled={false} onTouchTap={this.updateEvent} />
                        <Snackbar
                           open={this.props.attendeeNameEmptyFlag}
                           message="Please enter your name"
                           autoHideDuration={3000}
                           onRequestClose={this.handleRequestClose_NameEmpty}
                        />
                        <Snackbar
                           open={this.props.attendeeNameExistsFlag}
                           message="Name already exists. Please enter another name"
                           autoHideDuration={3000}
                           onRequestClose={this.handleRequestClose_NameExists}
                        />
                    </div>
              </div>

          );
      } else { // Cookie found? fill page with cookie data

          return (
              <div>
                <div className='row center-xs'>
                  <div className='col-xs-10'>
                    <TextField id='name' hintText='Name_Cookie' onChange={this.storeAttendeeName} value={this.props.attendeeName} />
                    <br />
                    <label style={styles.errorLabel}> {this.props.attendeeNameErrorLabel} </label>
                  </div>
                </div>
                <br></br>
                <br></br>
                <div>{this.MobiledateToggleSection()}</div>
                  <br />
                  <div className='row center-xs'>
                    <RaisedButton label='Update' primary={true} style={buttonStyle} disabled={false} onTouchTap={this.updateEvent} />
                  </div>
              </div>
          );
      }
  }

  handleRequestClose_NameEmpty() {
      this.props.dispatch(attendeeNameEmptyFlag(false));
    }

  handleRequestClose_NameExists() {
      this.props.dispatch(attendeeNameExistsFlag(false));
    }

// Fill the details about the event.
  getEventInformation() {
    let eventInformation = this.props.eventObj.name + this.props.languageJson.eventInformationPartOne + this.props.eventObj.purpose + this.props.languageJson.eventInformationPartTwo;
    return eventInformation;
  }

// Render the whole EventPage App. Starting point of this component.
  render() {

    let result;

    if (Object.keys(this.props.eventObj).length === 0 && this.props.eventObj.constructor === Object) { //Before fetching from DB
      result = (
        <div>
        </div>
      );
    } else { //After fetching from DB
      let dateArray = this.props.eventObj.dateArray;
      let tableheight= (35 * (dateArray.length + 2)); // Responsive height of the table based no. of dates
      result = (

        <div>
          <div>

          <MediaQuery minDeviceWidth={1224} orientation='landscape'>
              {/*<div> PC and Desktop code starts </div>*/}

              <br />
              <div className='row center-xs'>
                <label style={styles.formLabel}> {this.getEventInformation()} </label>
              </div>
              <br />
              <div className='row center-xs'>
                <label style={styles.formLabel}> {this.props.languageJson.eventTableLabel} </label>
              </div>
              <br />
              <div className='row'>
                <div className='col-xs-offset-2 col-xs-4'>
                  <label style={styles.formLabel3}> {this.props.languageJson.numberOfPeopleLabel} </label>
                </div>
                <div className='col-xs'>
                  <label style={styles.formLabel2}> {this.props.eventObj.attendees.length} </label>
                </div>
              </div>
              <br />
              <div className='row center-xs'>
                <div className='col-sm-12 col-md-10 col-lg-10 col-xs-12'>
                <ResponsiveFixedDataTable
                  rowsCount={dateArray.length}
                  width={800}
                  rowHeight={35}
                  containerStyle={{minHeight:tableheight}}
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
                </ResponsiveFixedDataTable>
              </div>
              </div>
              <br />
              {this.toggleCastAttendance()}

              {/*<div> PC and Desktop code ends </div>*/}

          </MediaQuery>

          <MediaQuery maxDeviceWidth={1224} >

            {/*<div> Tablet & Smartphone code starts </div>*/}

            <br></br>
              <div className='row center-xs'>
                <label style={styles.formLabel}> {this.props.eventObj.purpose} </label>
              </div>

              <br></br>

              <div>

                {this.toggleMobileCastAttendance()}

              </div>

          {/*<div> Tablet & Smartphone code ends </div>*/}

          </MediaQuery>
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
  personalizedDateSelection: PropTypes.object.isRequired,
  toggleCastAttendance: PropTypes.bool.isRequired,
  attendeeNameEmptyFlag: PropTypes.bool.isRequired,
  attendeeNameExistsFlag: PropTypes.bool.isRequired,
  updateAttendeeId: PropTypes.string.isRequired,
  updateAttendeeName: PropTypes.string.isRequired,
  updateAttendeeDate: PropTypes.object.isRequired,
  languageJson: PropTypes.object.isRequired
};


export default connect(state => ({
  eventObj: state.eventObj,
  attendeeName: state.attendeeName,
  attendeeNameErrorLabel: state.attendeeNameErrorLabel,
  personalizedDateSelection: state.personalizedDateSelection,
  toggleCastAttendance: state.toggleCastAttendance,
  attendeeNameEmptyFlag: state.attendeeNameEmptyFlag,
  attendeeNameExistsFlag: state.attendeeNameExistsFlag,
  updateAttendeeId: state.updateAttendeeId,
  updateAttendeeName: state.updateAttendeeName,
  updateAttendeeDate: state.updateAttendeeDate,
  languageJson: state.languageJson
}))(EventPageComponent);
