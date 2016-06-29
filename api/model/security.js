var mongoose = require('mongoose');
var Schema = mongoose.Schema;

module.exports = function(){
    var RoleSchema = new Schema({
        key: String,
        name: String,
        desc: String
    });
    var ResourceSchema = new Schema({
        key: String,
        name: String,
        desc: String,
        permission:Schema.Types.Mixed
    });
    mongoose.model('Role', RoleSchema);
    mongoose.model('Resource', ResourceSchema);
}
