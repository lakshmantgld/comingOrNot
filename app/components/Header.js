import React, { PropTypes, Component } from 'react';
import { connect } from 'react-redux';

import AppBar from 'material-ui/AppBar';
import { grey50 } from 'material-ui/styles/colors';
import IconMenu from 'material-ui/IconMenu';
import MenuItem from 'material-ui/MenuItem';
import FontIcon from 'material-ui/FontIcon';

import englishJson from '../../en.json';
import japaneseJson from '../../jp.json';

import { changelanguage } from './../actions/registerActions';

let styles = {
  icon2: {
    marginRight: 10
  }
}

class Header extends Component {
  constructor(props) {
    super(props);
    this.renderJapanese = this.renderJapanese.bind(this);
    this.renderEnglish = this.renderEnglish.bind(this);
  }

  componentDidMount() {
    this.props.dispatch(changelanguage(englishJson));
  }  

  renderEnglish() {
    console.log("json printing");
    console.log(JSON.stringify(englishJson));
    this.props.dispatch(changelanguage(englishJson));
  }

  renderJapanese() {
    console.log("json printing");
    console.log(JSON.stringify(japaneseJson));
    this.props.dispatch(changelanguage(japaneseJson));
  }

  render() {
    return (
      <header>
        <AppBar
          className='headerBar'
          title={<a href='/'>
                  <center> {this.props.languageJson.header} </center>
                </a>}
          showMenuIconButton={false}
          iconElementRight={
            <IconMenu
              iconButtonElement={
                <FontIcon className='material-icons' color={grey50} style={styles.icon2}>language</FontIcon>
              }
              targetOrigin={{horizontal: 'right', vertical: 'top'}}
              anchorOrigin={{horizontal: 'right', vertical: 'top'}}
            >
              <MenuItem primaryText="Japanese" onTouchTap={this.renderJapanese} />
              <MenuItem primaryText="English" onTouchTap={this.renderEnglish} />
            </IconMenu>
          }
        />
      </header>
    );
  }
}

Header.propTypes = {
  languageJson: PropTypes.object.isRequired
};

export default connect(state =>({
  languageJson: state.languageJson
}))(Header);
