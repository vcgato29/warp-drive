var Many = require('./factory/many');
var One = require('./factory/one');
var Attr = require('./factory/attr');
var pluralize = require('../utils/pluralize');

function Record(data) {
  this.__deleted = false;
  this.relationships = {};
  this.attributes = {};
  this.id = data.id;
  this.type = data.type;
}

function Factory(name, options, store, namespace) {
  this.relationships = {};
  this.attributes = {};
  this._nextId = 1;
  this.type = pluralize(name);
  this.name = name;
  this.store = store;
  this.namespace = namespace;

  var _factory = this;

  Object.keys(options).forEach(function(key) {
    var option = options[key];

    if (option instanceof Attr) {
      _factory.attributes[key] = option;
    } else if (option instanceof One || option instanceof Many) {
      _factory.relationships[key] = option;
    }
  });
}

Factory.prototype.generate = function generate(data) {
  data = data || {};

  if (data.id && data.id < this._nextId) {
    throw new Error('Attempting to recreate an existing record!');
  } else if (data.id) {
    this._nextId = data.id + 1;
  }

  var record = new Record({
    id: data.id || this._nextId++,
    type: this.type
  });

  // console.log('Generating ' + this.name + '#' + record.id, JSON.stringify(data));

  // eagerly push record for relationship building
  this.namespace.pushRecord(record);

  var i;
  var keys = Object.keys(this.attributes);
  var key;
  var attr;

  // populate attributes
  for (i = 0; i < keys.length; i++) {
    key = keys[i];
    attr = this.attributes[key];

    record.attributes[key] = data[key] !== undefined ? data[key] : attr.defaultValue();
  }

  // populate relationships
  keys = Object.keys(this.relationships);
  for (i = 0; i < keys.length; i++) {
    key = keys[i];
    attr = this.relationships[key];
    attr.parent = record;
    attr.parentType = this.name;

    var value = data[key] !== undefined ? data[key] : attr.defaultValue();

    if (value) {
/*
      console.log(
        '\tlinking reference: ' + this.name + '#' +
        (attr instanceof One ? 'one(' : 'many(') + key + ') ' + value);
*/
      var reference = attr.reference(value);
  //    console.log('linked:', reference.info());
      record.relationships[key] = reference;
    }
  }

  return record;
};

module.exports = Factory;
