var express = require('express');
var Account = require('mongoose').model('Account');
var router = express.Router();
router.get('/', function(req, res){
    console.log();
    res.render('profile/profile', {title: '个人信息'});
});

router.get('/password', function(req, res) {
    Account.findByUsername(req.user.username, function(err, user){
        res.render('profile/password-modify', {title: '密码修改', user: user})
    });
});
router.post('/password', function(req, res) {
    var user = new Account(req.user);
    user.authenticate(req.body.prePassword, function(err, result){
        if(err) console.log(err);
        if(result){
            user.setPassword(req.body.password, function(err, newPassUser){
                if(err) console.log(err);
                newPassUser.save(function(err){
                    if(err) console.log(err);
                    req.flash('success','密码修改成功');
                    res.redirect('/profile');
                });
            });
        }else{
            req.flash('error','原密码错误');
            res.redirect('/profile/password');
        }
    });
});

module.exports = router;