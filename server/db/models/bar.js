var faker = require('faker');
var props = require('../store/props');
var attr = props.attr;
var many = props.many;
var one = props.one;
var between = require('../utils/between');

module.exports = {
  name: attr('string', { defaultValue: function() { return faker.lorem.words(between(3, 7)); }}),
  description: attr('string', { defaultValue: function() { return faker.lorem.sentences(between(3, 7)); }}),
  baz: one('baz', { inverse: 'bar', defaultValue: true }),
  foos: many('foo', { inverse: 'bar', defaultValue: 4 })
};
