'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = function (field) {
  var deleteField = field || 'deleted';

  return function (hook) {
    var service = hook.service;
    hook.data = hook.data || {};
    hook.params.query = hook.params.query || {};
    (0, _checkContext2.default)(hook, 'before', null, 'softDelete');

    if (hook.params.query.$disableSoftDelete) {
      delete hook.params.query.$disableSoftDelete;
      return hook;
    }

    switch (hook.method) {
      case 'find':
        hook.params.query[deleteField] = { $ne: true };
        return hook;
      case 'get':
        return throwIfItemDeleted(hook.id, true).then(function (data) {
          hook.result = data;
          return hook;
        });
      case 'create':
        return hook;
      case 'update': // fall through
      case 'patch':
        if (hook.id !== null) {
          return throwIfItemDeleted(hook.id).then(function () {
            return hook;
          });
        }
        hook.params.query[deleteField] = { $ne: true };
        return hook;
      case 'remove':
        return Promise.resolve().then(function () {
          return hook.id ? throwIfItemDeleted(hook.id) : null;
        }).then(function () {
          hook.data[deleteField] = true;
          hook.params.query[deleteField] = { $ne: true };
          hook.params.query.$disableSoftDelete = true;

          return service.patch(hook.id, hook.data, hook.params).then(function (result) {
            hook.result = result;
            return hook;
          });
        });
    }

    function throwIfItemDeleted(id, isGet) {
      var params = isGet ? hook.params : {
        query: {},
        provider: hook.params.provider,
        authenticated: hook.params.authenticated,
        user: hook.params.user
      };

      params.query.$disableSoftDelete = true;

      return service.get(id, params).then(function (data) {
        delete params.query.$disableSoftDelete;

        if (data[deleteField]) {
          throw new errors.NotFound('Item has been soft deleted.');
        }
        return data;
      }).catch(function () {
        throw new errors.NotFound('Item not found.');
      });
    }
  };
};

var _feathersErrors = require('feathers-errors');

var _feathersErrors2 = _interopRequireDefault(_feathersErrors);

var _checkContext = require('./check-context');

var _checkContext2 = _interopRequireDefault(_checkContext);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var errors = _feathersErrors2.default.errors;

module.exports = exports['default'];