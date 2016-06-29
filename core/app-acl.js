var mongoose = require('mongoose');
var acl = require('acl');
global.ACL = new acl(new acl.mongodbBackend(mongoose.connection.db, 'acl_'));