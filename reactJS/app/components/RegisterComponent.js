import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';
// The below code is for extracting the location of browser. not working in localhost.
//import geolocator from 'geolocator';
import {grey600, red500, grey900, grey50} from 'material-ui/styles/colors';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton'
import Chip from 'material-ui/Chip';
import {Card, CardActions, CardHeader, CardText} from 'material-ui/Card';
import englishJson from '../../en.json';
import MediaQuery from 'react-responsive';
import InfiniteCalendar from 'react-infinite-calendar';
import Geosuggest from 'react-geosuggest';
import {Step, Stepper, StepLabel, StepContent} from 'material-ui/Stepper';
import FlatButton from 'material-ui/FlatButton';
import Dialog from 'material-ui/Dialog';
import Snackbar from 'material-ui/Snackbar';

import {
    storeName,
    storePurpose,
    registerEvent,
    storeDateArray,
    storeDateArrayErrorLabel,
    popDateArray,
    stepIncrease,
    stepDecrease,
    storeNameErrorLabel,
    storePurposeErrorLabel,
    storeLocation,
    changelanguage,
    storeDisableFlag,
    updateNotificationFlag
} from './../actions/registerActions';

let styles = {
    formLabel: {
        text: 'bold',
        fontSize: '25px',
        color: grey600
    },
    errorLabel: {
        text: 'bold',
        fontSize: '22px',
        color: red500
    },
    chip: {
        margin: 4
    },
    underlineStyle: {
        borderColor: grey900
    },
    dateSelectLabel: {
        fontSize: '19px'
    },
    datePush: {
        marginTop: '20px'
    },
    cal: {
        backgroundColor: 'rgba(78, 74, 74, 0.05)'
    }
};
let datePushResponsive = {
    marginTop: 30
}
let buttonStyle = {
    margin: 12,
    color: 'rgb(255, 255, 255)'
};

let mymap;

class RegisterComponent extends Component {
    constructor(props) {
        super(props);
        this.storeName = this.storeName.bind(this);
        this.storePurpose = this.storePurpose.bind(this);
        this.registerEvent = this.registerEvent.bind(this);
        this.storeDate = this.storeDate.bind(this);
        this.renderChip = this.renderChip.bind(this);
        this.storeLocation = this.storeLocation.bind(this);
        this.suggestLocation = this.suggestLocation.bind(this);
        this.validateRegisterEvent = this.validateRegisterEvent.bind(this);
        //this.storeStepIndex = this.storeStepIndex.bind(this);
        this.stepIncrease = this.stepIncrease.bind(this);
        this.stepDecrease = this.stepDecrease.bind(this);
        this.checkDisableFlag = this.checkDisableFlag.bind(this);
        this.handleRequestClose = this.handleRequestClose.bind(this);
    }

    componentDidMount() {}

    // method is invoked when you delete a selected date, it in turn deletes from the state object.
    handleRequestDelete(label) {
        this.props.dispatch(popDateArray(label))
        if (this.props.dateArray.length <= 5) {
            this.props.dispatch(storeDateArrayErrorLabel(''));
        }
    }

    // stores the name of the event creator.
    storeName(e) {
        if (e.target.value.length >= '40') {
            this.props.dispatch(storeNameErrorLabel(this.props.languageJson.nameErrorLabel))
        } else {
            this.props.dispatch(storeNameErrorLabel(''))
            this.props.dispatch(storeName(e.target.value));
        }
    }

    // stores the purpose of the event and throws an error in case of any edge cases failed.
    storePurpose(e) {
        if (e.target.value.length >= '100') {
            this.props.dispatch(storePurposeErrorLabel(this.props.languageJson.purposeErrorLabel))
        } else {
            this.props.dispatch(storePurposeErrorLabel(''))
            this.props.dispatch(storePurpose(e.target.value));
        }
    }

    // Stores the selected date in the state object.
    storeDate(date) {
        if (this.props.dateArray.length <= 5) {
            (this.props.dateArray.indexOf(date.format('ddd, MMM Do YYYY')) == -1)
                ? this.props.dispatch(storeDateArray(date.format('ddd, MMM Do YYYY')))
                : console.log("Duplicate date");
        } else {
            this.props.dispatch(storeDateArrayErrorLabel(this.props.languageJson.dateArrayExcessErrorLabel));
        }
    }

    storeLocation(location) {
        this.props.dispatch(storeLocation(location));
    }


    suggestLocation(location) {
        this.props.dispatch(storeLocation(location.label));
    }

    registerEvent() {
        let formattedEnteredDates = {};
        for (let i = 0; i < this.props.dateArray.length; i++) {
            let date = this.props.dateArray[i];
            let formattedDate;

            if (date.indexOf("th") !== -1) {
                formattedDate = date.replace("th", "");
            } else if (date.indexOf("st") !== -1) {
                formattedDate = date.replace("st", "");
            } else if (date.indexOf("nd") !== -1) {
                formattedDate = date.replace("nd", "");
            } else {
                formattedDate = date.replace("rd", "");
            }
            formattedEnteredDates[formattedDate.split(",")[1]] = date;
        }

        let unorderedDates = Object.keys(formattedEnteredDates);
        let intermediateSortedDates = unorderedDates.sort(function(a, b) {
            return new Date(a) - new Date(b);
        });

        let sortedDates = [];

        for (let j = 0; j < intermediateSortedDates.length; j++) {
            sortedDates[j] = formattedEnteredDates[intermediateSortedDates[j]];
        }

        this.props.dispatch(registerEvent(this.props.name, this.props.purpose, sortedDates, this.props.location));
    }

    validateRegisterEvent() {
      if (this.props.name.length === 0) {
        this.props.dispatch(storeNameErrorLabel(this.props.languageJson.nameErrorLabelRequired));
      } else if (this.props.purpose.length === 0) {
        this.props.dispatch(storePurposeErrorLabel(this.props.languageJson.purposeErrorLabelRequired));
      } else if (this.props.dateArray.length === 0){
        this.props.dispatch(storeDateArrayErrorLabel(this.props.languageJson.dateArrayEmptyErrorLabel));
      } else {
        this.props.dispatch(storeDisableFlag('registerEvent'));
        this.registerEvent();
      }
    }

    renderChip(data) {
        return (

            <div className='col-xs-6'>
                <Chip key={data} onRequestDelete={() => this.handleRequestDelete(data)} style={styles.chip}>
                    {data}
                </Chip>
            </div>

        );
    }

    checkDisableFlag() {
     if(this.props.disableFlag === 'registerEvent'){
       return true;
     } else {
       return false;
     }
    }

    stepIncrease() {
      switch (this.props.stepIndex)
      {
        case 0:
          if (this.props.name.length === 0) {
            this.props.dispatch(storeNameErrorLabel(this.props.languageJson.nameErrorLabelRequired));
          } else if (this.props.purpose.length === 0) {
            this.props.dispatch(storePurposeErrorLabel(this.props.languageJson.purposeErrorLabelRequired));
          } else {
            this.props.dispatch(stepIncrease(this.props.stepIndex));
          }
        break;
        case 1:
          this.props.dispatch(stepIncrease(this.props.stepIndex));
        break;
        case 2:
          this.validateRegisterEvent();
        break;
        default:
          console.log("default ");
      }
    }

    stepDecrease() {
        this.props.dispatch(stepDecrease(this.props.stepIndex));
    }

    renderStepActions(step) {
      const stepIndex = this.props.stepIndex;

      return (
      <div style={{margin: '12px 0'}}>
        <RaisedButton
          label={stepIndex === 2 ? 'Register' : 'Next'}
          disableTouchRipple={true}
          disableFocusRipple={true}
          primary={true}
          onTouchTap={this.stepIncrease}
          style={{marginRight: 12}}
        />
        {step > 0 && (
          <FlatButton
            label="Back"
            disabled={stepIndex === 0}
            disableTouchRipple={true}
            disableFocusRipple={true}
            onTouchTap={this.stepDecrease}
          />
        )}
      </div>
    );
    }

    handleRequestClose() {
        this.props.dispatch(updateNotificationFlag(''));
        this.props.dispatch(storeDisableFlag(''));
    }

    checkNotificationFlag() {
      if (this.props.notificationFlag === 'registerEventServerError') {
        return true;
      } else {
        return false;
      }
    }

    render() {

        let today = new Date(); // Get today's date to give minimum limit to the calendar
        let dateArray = this.props.dateArray.map(this.renderChip, this);


        return (
            <div>
                <MediaQuery maxDeviceWidth={1224}>
                    <div>
                        {/**Mobile & Tablet*/}
                        <br></br><br></br>


                        <div className='row'>
                            <div className='col-sm-offset-2 col-sm-8 col-xs-12'>
                                <Stepper activeStep={this.props.stepIndex} orientation="vertical">
                                    <Step>
                                        <StepLabel>Enter your name and events name</StepLabel>
                                        <StepContent>

                                                                      <div className='row'>

                                                                          <div className='col-xs-12'>
                                                                              <TextField id='name' floatingLabelText={this.props.languageJson.name} onChange={this.storeName} floatingLabelFocusStyle={{
                                                                                  color: grey900
                                                                              }} underlineFocusStyle={styles.underlineStyle} value={this.props.name}/>
                                                                              <br/>
                                                                              <label style={styles.errorLabel}>
                                                                                  {this.props.nameErrorLabel}
                                                                              </label>
                                                                          </div>
                                                                      </div>

                                                                      <div className='row'>

                                                                          <div className='col-xs-12'>
                                                                              <TextField id='purpose' floatingLabelText={this.props.languageJson.purpose} onChange={this.storePurpose} floatingLabelFocusStyle={{
                                                                                  color: grey900
                                                                              }} underlineFocusStyle={styles.underlineStyle} value={this.props.purpose}/>

                                                                              <label style={styles.errorLabel}>
                                                                                  {this.props.purposeErrorLabel}
                                                                              </label>
                                                                          </div>
                                                                      </div>

                                            {this.renderStepActions(0)}
                                        </StepContent>
                                    </Step>
                                    <Step>
                                        <StepLabel>Enter events location (OPTIONAL)</StepLabel>
                                        <br></br>
                                        <StepContent>
                                          <div className='row'>
                                              <div className='col-xs-12'>

                                                  <Geosuggest style={{
                                                      'input': {},
                                                      'suggests': {},
                                                      'suggestItem': {}
                                                  }} placeholder='Restaurant location' initialValue='' country='JP' onSuggestSelect={this.suggestLocation} onChange={this.storeLocation} location={new google.maps.LatLng(35.44371, 139.63803)} radius='40'/>

                                              </div>
                                          </div>
                                          <br></br>
                                            {this.renderStepActions(1)}
                                        </StepContent>
                                    </Step>
                                    <Step>
                                        <StepLabel>{this.props.languageJson.calendarLabel}</StepLabel>
                                        <StepContent style={{paddingLeft:"0px",paddingRight:"0px",marginLeft:"0px"}}>
                                          {/*<div className='row' style={styles.datePush}>
                                              <div className='col-xs-12'>
                                                  <label style={styles.dateSelectLabel}>
                                                      {this.props.languageJson.calendarLabel}
                                                  </label>
                                              </div><br/><br/></div>*/}
                                          <div className='row'>

                                              <div className='col-xs-12'>
                                                  <InfiniteCalendar theme={{
                                                      selectionColor: 'rgb(6, 5, 6)',
                                                      textColor: {
                                                          default: '#333',
                                                          active: '#FFF'
                                                      },
                                                      weekdayColor: 'rgb(49, 44, 49)',
                                                      headerColor: 'rgb(6, 5, 6)',
                                                      floatingNav: {
                                                          background: 'rgb(6, 5, 6)',
                                                          color: '#FFF',
                                                          chevron: '#FFA726'
                                                      }
                                                  }} layout='portrait' width={'100%'} height={300} rowHeight={55}  min={today} onSelect={this.storeDate} keyboardSupport={true}/>
                                              </div>
                                          </div>
                                          <div className="row">
                                              <div className="col-xs-12" style={datePushResponsive}>
                                                  <div className='row'>
                                                      {dateArray}
                                                  </div>
                                                  <div className='row center-xs'>
                                                      <label style={styles.errorLabel}>
                                                          {this.props.dateArrayErrorLabel}
                                                      </label>
                                                      <Snackbar
                                                         open={this.checkNotificationFlag()}
                                                         message={"Server Error!!"}
                                                         autoHideDuration={3000}
                                                         onRequestClose={this.handleRequestClose}
                                                      />
                                                  </div>
                                              </div>
                                          </div>
                                          {/**<br/>
                                          <div className='row col-xs-offset-2 center-xs' id="regButton">
                                              <RaisedButton label={this.props.languageJson.register} labelColor={grey50} style={buttonStyle} backgroundColor={grey900} disabled={false} onTouchTap={this.registerEvent}/>
                                              <br/>
                                              <br/>
                                              <br/>
                                          </div>*/}

                                            {this.renderStepActions(2)}
                                        </StepContent>
                                    </Step>
                                </Stepper>
                            </div>
                        </div>

                    </div>
                </MediaQuery>

                <MediaQuery minDeviceWidth={1224} orientation='landscape'>
                    <div className="row" id='fullRow'>
                        {/**Laptop*/}
                        <div className="col-md-4 col-md-offset-1">
                            <Card>
                                <div className='row'>
                                    <br/>

                                    <div className='row'>

                                        <div className='col-md-6'>
                                            <TextField id='name' floatingLabelText={this.props.languageJson.name} onChange={this.storeName} floatingLabelFocusStyle={{
                                                color: grey900
                                            }} underlineFocusStyle={styles.underlineStyle} value={this.props.name}/>
                                            <br/>
                                            <label style={styles.errorLabel}>
                                                {this.props.nameErrorLabel}
                                            </label>
                                        </div>
                                    </div>

                                    <div className='row'>

                                        <div className='col-md-6'>
                                            <TextField id='purpose' floatingLabelText={this.props.languageJson.purpose} onChange={this.storePurpose} floatingLabelFocusStyle={{
                                                color: grey900
                                            }} underlineFocusStyle={styles.underlineStyle} value={this.props.purpose}/>

                                            <label style={styles.errorLabel}>
                                                {this.props.purposeErrorLabel}
                                            </label>
                                        </div>
                                    </div>
                                    <br/>
                                    <br/>
                                    <div className='row' style={styles.datePush}>
                                        <div className='col-md-6'>
                                            <Geosuggest placeholder='Restaurant location' initialValue='' country='JP' onSuggestSelect={this.suggestLocation} onChange={this.storeLocation} location={new google.maps.LatLng(35.44371, 139.63803)} radius='40'/>
                                        </div>
                                    </div>
                                    <br/>
                                    <br/>
                                    <br/>
                                    <br/>
                                    <div className='row' style={styles.datePush}>
                                        <div className='col-md-12'>
                                            <label style={styles.dateSelectLabel}>
                                                {this.props.languageJson.calendarLabel}
                                            </label>

                                        </div><br/><br/></div>
                                    <div className="col-xs-12">
                                        <div className='row'>{dateArray}</div>
                                        <div className='row center-xs'>
                                            <label style={styles.errorLabel}>
                                                {this.props.dateArrayErrorLabel}
                                            </label>
                                        </div>
                                    </div>
                                    <br/>

                                    <div className='row col-md-offset-2 center-xs' id="regButton">
                                        <RaisedButton label={this.props.languageJson.register} labelColor={grey50} style={buttonStyle} backgroundColor={grey900} disabled={this.checkDisableFlag()} onTouchTap={this.validateRegisterEvent}/>
                                        <br/>
                                        <br/>
                                        <br/>
                                    </div>

                                </div>
                            </Card>
                            <Dialog
                              title={"Error in Server!! Please Try again after some time!!"}
                              actions={
                                <RaisedButton label='Ok'
                                 backgroundColor={"rgb(67, 67, 67)"}
                                 labelColor={"white"}
                                 style={buttonStyle}
                                 disabled={false}
                                 onTouchTap={this.handleRequestClose}
                                />
                              }
                              modal={true}
                              open={this.checkNotificationFlag()}
                            >
                            </Dialog>

                        </div>

                        <div className='col-md-1 col-md-offset-1'>
                            <div className='verticalLine'></div>
                        </div>
                        <div className='col-md-4'>
                            <div>

                                <div className='col-xs-6'>
                                    <InfiniteCalendar theme={{
                                        selectionColor: 'rgb(6, 5, 6)',
                                        textColor: {
                                            default: '#333',
                                            active: '#FFF'
                                        },
                                        weekdayColor: 'rgb(49, 44, 49)',
                                        headerColor: 'rgb(6, 5, 6)',
                                        floatingNav: {
                                            background: 'rgb(6, 5, 6)',
                                            color: '#FFF',
                                            chevron: '#FFA726'
                                        }
                                    }} layout='portrait' width={400} height={300} rowHeight={55}  min={today} onSelect={this.storeDate} keyboardSupport={true}/>
                                </div>
                            </div>
                        </div>
                    </div>
                </MediaQuery>
            </div>
        );
    }
}

RegisterComponent.propTypes = {
    name: PropTypes.string.isRequired,
    purpose: PropTypes.string.isRequired,
    dateArray: PropTypes.array.isRequired,
    dateArrayErrorLabel: PropTypes.string.isRequired,
    nameErrorLabel: PropTypes.string.isRequired,
    purposeErrorLabel: PropTypes.string.isRequired,
    stepIndex: PropTypes.number.isRequired,
    location: PropTypes.string.isRequired,
    languageJson: PropTypes.object.isRequired,
    disableFlag: PropTypes.string.isRequired,
    notificationFlag: PropTypes.string.isRequired
};

export default connect(state => ({
    name: state.name,
    purpose: state.purpose,
    dateArray: state.dateArray,
    dateArrayErrorLabel: state.dateArrayErrorLabel,
    nameErrorLabel: state.nameErrorLabel,
    purposeErrorLabel: state.purposeErrorLabel,
    stepIndex: state.stepIndex,
    location: state.location,
    languageJson: state.languageJson,
    disableFlag: state.disableFlag,
    notificationFlag: state.notificationFlag
}))(RegisterComponent);
