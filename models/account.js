var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var passportLocalMongoose = require('passport-local-mongoose');

var AccountSchema = new Schema({
    username: String,
    password: String,
    email: String
});
AccountSchema.plugin(passportLocalMongoose, {
    errorMessages:{
        IncorrectUsernameError: '无效用户名',
        IncorrectPasswordError: '用户名与密码不匹配',
        AttemptTooSoonError: '登录过于频繁，帐号被临时锁定，请稍后再试',
        TooManyAttemptsError: '登录失败次数过多，帐号已经被锁定，请联系管理员',
        UserExistsError: '用户已经存在',
        MissingUsernameError: '登录未给定用户名',
        MissingPasswordError: '登录未给定密码'
    },
    limitAttempts: true,
    maxAttempts: 10,
    interval: 100,
    maxInterval: 60000
});

module.exports = mongoose.model('Account', AccountSchema);
