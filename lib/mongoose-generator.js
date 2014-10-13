'use strict';

var mongoose = require('mongoose'),
    utils = require('./utils'),
    Schema = mongoose.Schema,
    Mixed = mongoose.Types.Mixed,
    ObjectId = mongoose.Schema.ObjectId,
    connection,
    hash = {
        validator: {},
        setter: {},
        getter: {},
        default: {}
    };

var set = function (param) {
    return function (key, value) {
        if (!utils.checkType('Function', value)) throw new Error('expected type Function for '+value);
        if (!utils.checkType('String', key)) throw new Error('expected type String for '+key);
        if (param === 'validator') hash.validator[key] = value;
        if (param === 'setter') hash.setter[key] = value;
        if (param === 'getter') hash.getter[key] = value;
        if (param === 'default') hash.default[key] = value;
    };
};


var setConnection = function (_connection) {
    if (!_connection instanceof mongoose.Connection)
        throw new Error('Need connection '+_connection);
    connection = _connection;
};


var get = function (param, key) {
    var fn = hash && hash[param] && hash[param][key];
    if (!fn) throw new Error('Undefined --- ' + param + ' for name --- '+key);
    return fn;
};



var matchType = function(type) {
    var output;
    switch (type.toLowerCase()) {
    case 'string': output = String; break;
    case 'number': output = Number; break;
    case 'boolean': output = Boolean; break;
    case 'date': output = Date; break;
    case 'buffer': output = Buffer; break;
    case 'objectid': output = mongoose.Schema.ObjectId; break;
    case 'mixed': output = mongoose.Types.Mixed; break;
    default: throw new Error('Unknown Type --------- '+type);
    }
    return output;
};


var check = function (type, value) {
    if (type === 'match') {
        if (!utils.checkType('String', value)) throw new Error('expected string for match key');
        return new RegExp(value);
    }
    throw new Error('unexpected type '+type);
};

var convert = function (descriptor) {
    var encoded = JSON.stringify(descriptor);
    var decoded = JSON.parse(encoded, function (key, value) {
        if (key === 'type' && !((typeof value)=='object')) return matchType(value);
        if (key === 'validate') return get('validator', value);
        if (key === 'get') return get('getter', value);
        if (key === 'set') return get('setter', value);
        if (key === 'default') return get('default', value);
        if (key === 'match') return check(key, value);
        if (key === '') return value; // toplevel object
        //if (whitelist.indexOf(key) === -1) return;
        return value;
    });
    return decoded;
};

var schema = function (name, descriptor) {
    if (!utils.checkType('String', name)) throw new Error('expected string for param name');
    if (!utils.checkType('Object', descriptor)) throw new Error('expected object for param descriptor');
    if (!connection) throw new Error('expected a mongoose.Connection params. Call setConnection() before schema()');
    var definition = convert(descriptor);
    var schema = new mongoose.Schema(definition);
    return connection.model(name, schema);
};

exports.setValidator = set('validator');
exports.setConnection = setConnection;
exports.setDefault = set('default');
exports.schema = schema;
