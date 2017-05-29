'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = function (prop) {
  var beforeField = prop || 'before';

  return function (context) {
    (0, _checkContext2.default)(context, 'before', ['get', 'update', 'patch', 'remove'], 'stashBefore');

    if (context.id === null || context.id === undefined) {
      throw new _feathersErrors2.default.BadRequest('Id is required. (stashBefore)');
    }

    if (context.params.query && context.params.query.$disableStashBefore) {
      delete context.params.query.$disableStashBefore;
      return context;
    }

    var params = context.method === 'get' ? context.params : {
      provider: context.params.provider,
      authenticated: context.params.authenticated,
      user: context.params.user
    };

    params.query = params.query || {};
    params.query.$disableStashBefore = true;

    return context.service.get(context.id, params).then(function (data) {
      delete params.query.$disableStashBefore;

      context.params[beforeField] = data;
      return context;
    }).catch(function () {
      return context;
    });
  };
};

var _feathersErrors = require('feathers-errors');

var _feathersErrors2 = _interopRequireDefault(_feathersErrors);

var _checkContext = require('./check-context');

var _checkContext2 = _interopRequireDefault(_checkContext);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

module.exports = exports['default'];