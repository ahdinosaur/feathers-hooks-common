'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = function () {
  for (var _len = arguments.length, fieldNames = Array(_len), _key = 0; _key < _len; _key++) {
    fieldNames[_key] = arguments[_key];
  }

  return function (data) {
    (0, _setFields3.default)(data, function () {
      return new Date();
    }, fieldNames, 'filteredAt');
    return data;
  };
};

var _setFields2 = require('../common/_set-fields');

var _setFields3 = _interopRequireDefault(_setFields2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

module.exports = exports['default'];