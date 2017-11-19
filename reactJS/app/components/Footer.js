import React, {Component} from 'react';
import FontIcon from 'material-ui/FontIcon';
import {BottomNavigation, BottomNavigationItem} from 'material-ui/BottomNavigation';
import Paper from 'material-ui/Paper';
import IconLocationOn from 'material-ui/svg-icons/communication/location-on';

const recentsIcon = <FontIcon className="material-icons">restore</FontIcon>;
const favoritesIcon = <FontIcon className="material-icons">favorite</FontIcon>;
const nearbyIcon = <IconLocationOn />;

/**
 * A simple example of `BottomNavigation`, with three labels and icons
 * provided. The selected `BottomNavigationItem` is determined by application
 * state (for instance, by the URL).
 */
class BottomNavigationExampleSimple extends Component {




  render() {
    return (
      <div className='row footer-row'>
        <div className='col-sm-offset-1 col-md-5 col-sm-5 col-xs-6'>
          <a href='/privacypolicy' style={{'color': 'grey'}}><span>Privacy Policy</span></a>
        </div>
        <div className='col-md-5 col-sm-5 col-xs-6 end-xs'>
          <span>Copyright ©2017 Comingornot</span>
        </div>
      </div>
    );
  }
}

export default BottomNavigationExampleSimple;
