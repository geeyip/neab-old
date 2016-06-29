var mongoose = require('mongoose');
var acl = require('acl');
acl = new acl(new acl.mongodbBackend(mongoose.connection.db, 'acl_'));
module.exports = acl;