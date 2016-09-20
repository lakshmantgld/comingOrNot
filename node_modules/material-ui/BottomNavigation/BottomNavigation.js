'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _simpleAssign = require('simple-assign');

var _simpleAssign2 = _interopRequireDefault(_simpleAssign);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

function getStyles(props, context) {
  var bottomNavigation = context.muiTheme.bottomNavigation;


  var styles = {
    root: {
      position: 'relative',
      width: '100%',
      display: 'flex',
      justifyContent: 'center',
      backgroundColor: bottomNavigation.backgroundColor,
      height: bottomNavigation.height
    },
    item: {
      flex: '1'
    }
  };

  return styles;
}

var BottomNavigation = function BottomNavigation(props, context) {
  var children = props.children;
  var style = props.style;
  var selectedIndex = props.selectedIndex;

  var other = _objectWithoutProperties(props, ['children', 'style', 'selectedIndex']);

  var prepareStyles = context.muiTheme.prepareStyles;

  var styles = getStyles(props, context);

  var preparedChildren = _react.Children.map(children, function (child, index) {
    return (0, _react.cloneElement)(child, {
      style: (0, _simpleAssign2.default)({}, styles.item, child.props.style),
      selected: index === selectedIndex
    });
  });

  return _react2.default.createElement(
    'div',
    _extends({}, other, { style: prepareStyles((0, _simpleAssign2.default)({}, styles.root, style)) }),
    preparedChildren
  );
};

BottomNavigation.propTypes = {
  /**
   * The `BottomNavigationItem`s to populate the element with.
   */
  children: _react.PropTypes.node,
  /**
   * The index of the currently selected navigation item.
   */
  selectedIndex: _react.PropTypes.number,
  /**
   * @ignore
   * Override the inline-styles of the root element.
   */
  style: _react.PropTypes.object
};

BottomNavigation.contextTypes = {
  muiTheme: _react.PropTypes.object.isRequired
};

exports.default = BottomNavigation;