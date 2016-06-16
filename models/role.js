var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var RoleSchema = new Schema({
    key: String,
    name: String,
    desc: String
});
module.exports = mongoose.model('ACL_ROLES', RoleSchema);
