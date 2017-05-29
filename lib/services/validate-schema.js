'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = function (schema, ajvOrAjv) {
  var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : { allErrors: true };

  var addNewError = options.addNewError || addNewErrorDflt;
  delete options.addNewError;
  // TODO: Any better way to tell if ajvOrAjv is an instance or a constructor?
  var ajv = void 0,
      Ajv = void 0;
  if (typeof ajvOrAjv.addKeyword !== 'function') {
    Ajv = ajvOrAjv;
    ajv = new Ajv(options);
  } else {
    ajv = ajvOrAjv;
  }
  var validate = ajv.compile(schema); // for fastest execution

  return function (hook) {
    var items = (0, _getItems2.default)(hook);
    var itemsArray = Array.isArray(items) ? items : [items];
    var itemsLen = itemsArray.length;
    var errorMessages = null;
    var invalid = false;

    if (schema.$async) {
      return Promise.all(itemsArray.map(function (item, index) {
        return validate(item).catch(function (err) {
          if (!(err instanceof ajv.constructor.ValidationError)) throw err;

          invalid = true;

          addErrors(err.errors, index);
        });
      })).then(function () {
        if (invalid) {
          throw new errors.BadRequest('Invalid schema', { errors: errorMessages });
        }
      });
    }

    itemsArray.forEach(function (item, index) {
      if (!validate(item)) {
        invalid = true;

        addErrors(validate.errors, index);
      }
    });

    if (invalid) {
      throw new errors.BadRequest('Invalid schema', { errors: errorMessages });
    }

    function addErrors(errors, index) {
      errors.forEach(function (ajvError) {
        errorMessages = addNewError(errorMessages, ajvError, itemsLen, index);
      });
    }
  };
};

var _feathersErrors = require('feathers-errors');

var _feathersErrors2 = _interopRequireDefault(_feathersErrors);

var _getItems = require('./get-items');

var _getItems2 = _interopRequireDefault(_getItems);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var errors = _feathersErrors2.default.errors;

function addNewErrorDflt(errorMessages, ajvError, itemsLen, index) {
  var leader = itemsLen === 1 ? '' : 'in row ' + (index + 1) + ' of ' + itemsLen + ', ';
  var message = void 0;

  if (ajvError.dataPath) {
    message = '\'' + leader + ajvError.dataPath.substring(1) + '\' ' + ajvError.message;
  } else {
    message = '' + leader + ajvError.message;
    if (ajvError.params && ajvError.params.additionalProperty) {
      message += ': \'' + ajvError.params.additionalProperty + '\'';
    }
  }

  return (errorMessages || []).concat(message);
}
module.exports = exports['default'];