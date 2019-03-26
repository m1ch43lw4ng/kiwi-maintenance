'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; /* eslint react/require-default-props: 0 */


var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _classnames = require('classnames');

var _classnames2 = _interopRequireDefault(_classnames);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _utils = require('./utils');

var _utils2 = _interopRequireDefault(_utils);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var FooterCell = function FooterCell(props) {
  var index = props.index,
      column = props.column,
      columnData = props.columnData;
  var footer = column.footer,
      footerTitle = column.footerTitle,
      footerAlign = column.footerAlign,
      footerFormatter = column.footerFormatter,
      footerEvents = column.footerEvents,
      footerClasses = column.footerClasses,
      footerStyle = column.footerStyle,
      footerAttrs = column.footerAttrs;


  var cellAttrs = _extends({}, _utils2.default.isFunction(footerAttrs) ? footerAttrs(column, index) : footerAttrs, footerEvents);

  var text = '';
  if (_utils2.default.isString(footer)) {
    text = footer;
  } else if (_utils2.default.isFunction(footer)) {
    text = footer(columnData, column, index);
  }

  var cellStyle = {};
  var cellClasses = _utils2.default.isFunction(footerClasses) ? footerClasses(column, index) : footerClasses;

  if (footerStyle) {
    cellStyle = _utils2.default.isFunction(footerStyle) ? footerStyle(column, index) : footerStyle;
    cellStyle = cellStyle ? _extends({}, cellStyle) : cellStyle;
  }

  if (footerTitle) {
    cellAttrs.title = _utils2.default.isFunction(footerTitle) ? footerTitle(column, index) : text;
  }

  if (footerAlign) {
    cellStyle.textAlign = _utils2.default.isFunction(footerAlign) ? footerAlign(column, index) : footerAlign;
  }

  if (cellClasses) cellAttrs.className = (0, _classnames2.default)(cellAttrs.className, cellClasses);
  if (!_utils2.default.isEmptyObject(cellStyle)) cellAttrs.style = cellStyle;

  var children = footerFormatter ? footerFormatter(column, index) : text;

  return _react2.default.createElement('th', cellAttrs, children);
};

FooterCell.propTypes = {
  columnData: _propTypes2.default.array,
  index: _propTypes2.default.number,
  column: _propTypes2.default.object
};

exports.default = FooterCell;