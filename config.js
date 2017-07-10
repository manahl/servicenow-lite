"use strict";

var _ = require("underscore");
var path = require("path");

var etc = require("etc");

var configPath = path.join(require("app-root-dir").get(), "servicenow.yaml");
var config = etc().use(require("etc-yaml")).file(configPath).toJSON();

// 'CR1234' -> 'CR'
function getPrefix(recordId) {
  return recordId.replace(/[^A-Z]/g, "");
}

// Find the table whose prefix matches this recordId (e.g. 'CR1234')
// or prefix (e.g. 'CR'), and get the `key` requested, or
// `defaultValue` if key is not present.
function tableAttr(recordIdOrPrefix, key, defaultValue) {
  defaultValue = defaultValue || null;

  var prefix = getPrefix(recordIdOrPrefix);
  return (
    _.find(config.tables, function(table) {
      return table.prefix == prefix;
    })[key] || defaultValue
  );
}

function prefixFromTableName(tableName) {
  return _.find(config.tables, function(table) {
    return table.name == tableName;
  }).prefix;
}

function tableName(recordIdOrPrefix) {
  return tableAttr(recordIdOrPrefix, "name");
}

function dateField(recordIdOrPrefix) {
  return tableAttr(recordIdOrPrefix, "date_field", "sys_created_on");
}

function cloneFields(recordIdOrPrefix) {
  return tableAttr(recordIdOrPrefix, "clone_fields");
}

function webFields(recordIdOrPrefix) {
  return tableAttr(recordIdOrPrefix, "web_fields");
}

module.exports = {
  ROOT_URL: config.root_url,
  PREFIXES: _.pluck(config.tables, "prefix"),
  TABLE_NAMES: _.pluck(config.tables, "name"),
  getPrefix: getPrefix,
  prefixFromTableName: prefixFromTableName,
  tableName: tableName,
  dateField: dateField,
  cloneFields: cloneFields,
  webFields: webFields
};
