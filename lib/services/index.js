'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _conditionals2 = require('../common/_conditionals');

var _conditionals3 = _interopRequireDefault(_conditionals2);

var _callbackToPromise = require('./callback-to-promise');

var _callbackToPromise2 = _interopRequireDefault(_callbackToPromise);

var _checkContext = require('./check-context');

var _checkContext2 = _interopRequireDefault(_checkContext);

var _checkContextIf = require('./check-context-if');

var _checkContextIf2 = _interopRequireDefault(_checkContextIf);

var _client = require('./client');

var _client2 = _interopRequireDefault(_client);

var _combine = require('./combine');

var _combine2 = _interopRequireDefault(_combine);

var _debug = require('./debug');

var _debug2 = _interopRequireDefault(_debug);

var _deleteByDot = require('../common/delete-by-dot');

var _deleteByDot2 = _interopRequireDefault(_deleteByDot);

var _dePopulate = require('./de-populate');

var _dePopulate2 = _interopRequireDefault(_dePopulate);

var _disable = require('./disable');

var _disable2 = _interopRequireDefault(_disable);

var _disallow = require('./disallow');

var _disallow2 = _interopRequireDefault(_disallow);

var _disableMultiItemChange = require('./disable-multi-item-change');

var _disableMultiItemChange2 = _interopRequireDefault(_disableMultiItemChange);

var _discard = require('./discard');

var _discard2 = _interopRequireDefault(_discard);

var _existsByDot = require('../common/exists-by-dot');

var _existsByDot2 = _interopRequireDefault(_existsByDot);

var _getByDot = require('../common/get-by-dot');

var _getByDot2 = _interopRequireDefault(_getByDot);

var _getItems = require('./get-items');

var _getItems2 = _interopRequireDefault(_getItems);

var _isProvider = require('./is-provider');

var _isProvider2 = _interopRequireDefault(_isProvider);

var _legacyPopulate = require('./legacy-populate');

var _legacyPopulate2 = _interopRequireDefault(_legacyPopulate);

var _lowerCase = require('./lower-case');

var _lowerCase2 = _interopRequireDefault(_lowerCase);

var _paramsForServer = require('./params-for-server');

var _paramsForServer2 = _interopRequireDefault(_paramsForServer);

var _paramsFromClient = require('./params-from-client');

var _paramsFromClient2 = _interopRequireDefault(_paramsFromClient);

var _populate = require('./populate');

var _populate2 = _interopRequireDefault(_populate);

var _pluck = require('./pluck');

var _pluck2 = _interopRequireDefault(_pluck);

var _pluckQuery = require('./pluck-query');

var _pluckQuery2 = _interopRequireDefault(_pluckQuery);

var _preventChanges = require('./prevent-changes');

var _preventChanges2 = _interopRequireDefault(_preventChanges);

var _promiseToCallback = require('./promise-to-callback');

var _promiseToCallback2 = _interopRequireDefault(_promiseToCallback);

var _remove = require('./remove');

var _remove2 = _interopRequireDefault(_remove);

var _removeQuery = require('./remove-query');

var _removeQuery2 = _interopRequireDefault(_removeQuery);

var _replaceItems = require('./replace-items');

var _replaceItems2 = _interopRequireDefault(_replaceItems);

var _serialize = require('./serialize');

var _serialize2 = _interopRequireDefault(_serialize);

var _setByDot = require('../common/set-by-dot');

var _setByDot2 = _interopRequireDefault(_setByDot);

var _setCreatedAt = require('./set-created-at');

var _setCreatedAt2 = _interopRequireDefault(_setCreatedAt);

var _setNow = require('./set-now');

var _setNow2 = _interopRequireDefault(_setNow);

var _setSlug = require('./set-slug');

var _setSlug2 = _interopRequireDefault(_setSlug);

var _setUpdatedAt = require('./set-updated-at');

var _setUpdatedAt2 = _interopRequireDefault(_setUpdatedAt);

var _sifter = require('./sifter');

var _sifter2 = _interopRequireDefault(_sifter);

var _softDelete = require('./soft-delete');

var _softDelete2 = _interopRequireDefault(_softDelete);

var _stashBefore = require('./stash-before');

var _stashBefore2 = _interopRequireDefault(_stashBefore);

var _traverse = require('./traverse');

var _traverse2 = _interopRequireDefault(_traverse);

var _validate = require('./validate');

var _validate2 = _interopRequireDefault(_validate);

var _validateSchema = require('./validate-schema');

var _validateSchema2 = _interopRequireDefault(_validateSchema);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

var conditionals = (0, _conditionals3.default)(function (hookFnArgs, serviceHooks) {
  return serviceHooks ? _combine2.default.apply(undefined, _toConsumableArray(serviceHooks)).call(this, hookFnArgs[0]) : hookFnArgs[0];
});

exports.default = Object.assign({ callbackToPromise: _callbackToPromise2.default,
  checkContext: _checkContext2.default,
  checkContextIf: _checkContextIf2.default,
  client: _client2.default,
  combine: _combine2.default,
  debug: _debug2.default,
  deleteByDot: _deleteByDot2.default,
  dePopulate: _dePopulate2.default,
  disable: _disable2.default,
  disallow: _disallow2.default,
  disableMultiItemChange: _disableMultiItemChange2.default,
  discard: _discard2.default,
  existsByDot: _existsByDot2.default,
  getByDot: _getByDot2.default,
  getItems: _getItems2.default,
  isProvider: _isProvider2.default,
  legacyPopulate: _legacyPopulate2.default,
  lowerCase: _lowerCase2.default,
  paramsForServer: _paramsForServer2.default,
  paramsFromClient: _paramsFromClient2.default,
  populate: _populate2.default,
  pluck: _pluck2.default,
  pluckQuery: _pluckQuery2.default,
  preventChanges: _preventChanges2.default,
  promiseToCallback: _promiseToCallback2.default,
  remove: _remove2.default,
  removeQuery: _removeQuery2.default,
  replaceItems: _replaceItems2.default,
  serialize: _serialize2.default,
  setByDot: _setByDot2.default,
  setCreatedAt: _setCreatedAt2.default,
  setNow: _setNow2.default,
  setSlug: _setSlug2.default,
  setUpdatedAt: _setUpdatedAt2.default,
  sifter: _sifter2.default,
  softDelete: _softDelete2.default,
  stashBefore: _stashBefore2.default,
  traverse: _traverse2.default,
  validate: _validate2.default,
  validateSchema: _validateSchema2.default
}, conditionals);
module.exports = exports['default'];