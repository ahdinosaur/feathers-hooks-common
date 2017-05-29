'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

exports.default = function (options) {
  // options.schema is like { service: '...', permissions: '...', include: [ ... ] }
  options = options || {};

  if (typeof options === 'string') {
    for (var _len = arguments.length, rest = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
      rest[_key - 1] = arguments[_key];
    }

    return _legacyPopulate2.default.apply(undefined, [options].concat(rest));
  }

  var typeofSchema = _typeof(options.schema);
  if ((typeofSchema !== 'object' || options.schema === null) && typeofSchema !== 'function') {
    throw new Error('Options.schema is not an object. (populate)');
  }

  return function (hook) {
    var optionsDefault = {
      schema: {},
      checkPermissions: function checkPermissions() {
        return true;
      },
      profile: false
    };

    if (hook.params._populate === 'skip') {
      // this service call made from another populate
      return hook;
    }

    return Promise.resolve().then(function () {
      // 'options.schema' resolves to { permissions: '...', include: [ ... ] }

      var items = (0, _getItems2.default)(hook);
      var options1 = Object.assign({}, optionsDefault, options);
      var schema = options1.schema,
          checkPermissions = options1.checkPermissions;

      var schema1 = typeof schema === 'function' ? schema(hook, options1) : schema;
      var permissions = schema1.permissions || null;
      var baseService = schema1.service;

      if (typeof checkPermissions !== 'function') {
        throw new _feathersErrors2.default.BadRequest('Permissions param is not a function. (populate)');
      }

      if (baseService && baseService !== hook.path) {
        throw new _feathersErrors2.default.BadRequest('Schema is for ' + baseService + ' not ' + hook.path + '. (populate)');
      }

      if (permissions && !checkPermissions(hook, hook.path, permissions, 0)) {
        throw new _feathersErrors2.default.BadRequest('Permissions do not allow this populate. (populate)');
      }

      if ((typeof schema1 === 'undefined' ? 'undefined' : _typeof(schema1)) !== 'object') {
        throw new _feathersErrors2.default.BadRequest('Schema does not resolve to an object. (populate)');
      }

      var include = [].concat(schema1.include || []);
      return !include.length ? items : populateItemArray(options1, hook, items, include, 0);
    }).then(function (items) {
      (0, _replaceItems2.default)(hook, items);
      return hook;
    });
  };
};

var _feathersErrors = require('feathers-errors');

var _feathersErrors2 = _interopRequireDefault(_feathersErrors);

var _getByDot = require('../common/get-by-dot');

var _getByDot2 = _interopRequireDefault(_getByDot);

var _setByDot = require('../common/set-by-dot');

var _setByDot2 = _interopRequireDefault(_setByDot);

var _getItems = require('./get-items');

var _getItems2 = _interopRequireDefault(_getItems);

var _legacyPopulate = require('./legacy-populate');

var _legacyPopulate2 = _interopRequireDefault(_legacyPopulate);

var _replaceItems = require('./replace-items');

var _replaceItems2 = _interopRequireDefault(_replaceItems);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function populateItemArray(options, hook, items, includeSchema, depth) {
  // 'items' is an item or an array of items
  // 'includeSchema' is like [ { nameAs: 'author', ... }, { nameAs: 'readers', ... } ]

  if (items.toJSON || items.toObject) {
    throw new _feathersErrors2.default.BadRequest('Populate requires results to be plain JavaScript objects. (populate)');
  }

  if (!Array.isArray(items)) {
    return populateItem(options, hook, items, includeSchema, depth + 1);
  }

  return Promise.all(items.map(function (item) {
    return populateItem(options, hook, item, includeSchema, depth + 1);
  }));
}

function populateItem(options, hook, item, includeSchema, depth) {
  // 'item' is one item
  // 'includeSchema' is like [ { nameAs: 'author', ... }, { nameAs: 'readers', ... } ]

  var elapsed = {};
  var startAtAllIncludes = process.hrtime();
  var include = [].concat(includeSchema || []);
  item._include = [];

  return Promise.all(include.map(function (childSchema) {
    var query = childSchema.query,
        select = childSchema.select,
        parentField = childSchema.parentField;

    // A related column join is required if neither the query nor select options are provided.
    // That requires item[parentField] exist. (The DB handles child[childField] existence.)

    if (!query && !select && (!parentField || (0, _getByDot2.default)(item, parentField) === undefined)) {
      return undefined;
    }

    var startAtThisInclude = process.hrtime();
    return populateAddChild(options, hook, item, childSchema, depth).then(function (result) {
      var nameAs = childSchema.nameAs || childSchema.service;
      elapsed[nameAs] = getElapsed(options, startAtThisInclude, depth);

      return result;
    });
  })).then(function (children) {
    // 'children' is like
    //   [{ nameAs: 'authorInfo', items: {...} }, { nameAs: readersInfo, items: [{...}, {...}] }]
    if (options.profile !== false) {
      elapsed.total = getElapsed(options, startAtAllIncludes, depth);
      item._elapsed = elapsed;
    }

    children.forEach(function (child) {
      if (child) {
        (0, _setByDot2.default)(item, child.nameAs, child.items);
      }
    });

    return item;
  });
}

function populateAddChild(options, hook, parentItem, childSchema, depth) {
  /*
  @params
    'parentItem' is the item we are adding children to
    'childSchema' is like
      { service: 'comments',
        permissions: '...',
        nameAs: 'comments',
        asArray: true,
        parentField: 'id',
        childField: 'postId',
        query: { $limit: 5, $select: ['title', 'content', 'postId'], $sort: { createdAt: -1 } },
        select: (hook, parent, depth) => ({ something: { $exists: false }}),
        paginate: false,
        provider: hook.provider,
        useInnerPopulate: false,
        include: [ ... ] }
  @returns { nameAs: string, items: array }
  */

  var childField = childSchema.childField,
      paginate = childSchema.paginate,
      parentField = childSchema.parentField,
      permissions = childSchema.permissions,
      query = childSchema.query,
      select = childSchema.select,
      service = childSchema.service,
      useInnerPopulate = childSchema.useInnerPopulate;


  if (!service) {
    throw new _feathersErrors2.default.BadRequest('Child schema is missing the service property. (populate)');
  }

  // A related column join is required if neither the query nor select options are provided.
  if (!query && !select && !(parentField && childField)) {
    throw new _feathersErrors2.default.BadRequest('Child schema is missing parentField or childField property. (populate)');
  }

  if (permissions && !options.checkPermissions(hook, service, permissions, depth)) {
    throw new _feathersErrors2.default.BadRequest('Permissions for ' + service + ' do not allow include. (populate)');
  }

  var nameAs = childSchema.nameAs || service;
  parentItem._include.push(nameAs);

  return Promise.resolve().then(function () {
    return select ? select(hook, parentItem, depth) : {};
  }).then(function (selectQuery) {
    var sqlQuery = {};

    if (parentField) {
      var parentVal = (0, _getByDot2.default)(parentItem, parentField); // will not be undefined
      sqlQuery = _defineProperty({}, childField, Array.isArray(parentVal) ? { $in: parentVal } : parentVal);
    }

    var queryObj = Object.assign({}, query, sqlQuery, selectQuery // dynamic options override static ones
    );

    var serviceHandle = hook.app.service(service);

    if (!serviceHandle) {
      throw new _feathersErrors2.default.BadRequest('Service ' + service + ' is not configured. (populate)');
    }

    var paginateObj = { paginate: false };
    var paginateOption = paginate;
    if (paginateOption === true) {
      paginateObj = null;
    }
    if (typeof paginateOption === 'number') {
      paginateObj = { paginate: { default: paginateOption } };
    }

    var params = Object.assign({}, hook.params, paginateObj, { query: queryObj }, useInnerPopulate ? { _populate: 'skip' } : {}, 'provider' in childSchema ? { provider: childSchema.provider } : {});

    return serviceHandle.find(params);
  }).then(function (result) {
    result = result.data || result;

    if (result.length === 0) {
      return childSchema.asArray ? [] : null;
    }

    if (result.length === 1 && !childSchema.asArray) {
      result = result[0];
    }

    return childSchema.include && result ? populateItemArray(options, hook, result, childSchema.include, depth) : result;
  }).then(function (items) {
    return { nameAs: nameAs, items: items };
  });
}

// Helpers

function getElapsed(options, startHrtime, depth) {
  if (options.profile === true) {
    var elapsed = process.hrtime(startHrtime);
    return elapsed[0] * 1e9 + elapsed[1];
  } else if (options.profile !== false) {
    return depth; // for testing _elapsed
  }
}
module.exports = exports['default'];