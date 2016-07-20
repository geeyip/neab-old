var express = require('express');
var router = express.Router();
var formidable = require('formidable');
var uuid = require('node-uuid');
var fs = require('fs');
var path = require('path');

router.get('/image', function(req, res){
    var images = req.session.images;
    res.render('upload/image', {title: '图片上传',images:images});
});

router.post('/image', function(req, res, next) {
    var form = new formidable.IncomingForm();
    form.encoding = 'utf-8';
    form.uploadDir = 'public/upload/image/';
    form.keepExtensions = true;
    form.maxFieldsSize = 2 * 1024 * 1024;

    form.parse(req, function(err, fields, files) {
        if (err) {
            return next(err);
        }
        var extName = '';  //后缀名
        switch (files.fulAvatar.type) {
            case 'image/pjpeg':
                extName = 'jpg';
                break;
            case 'image/jpeg':
                extName = 'jpg';
                break;
            case 'image/png':
                extName = 'png';
                break;
            case 'image/x-png':
                extName = 'png';
                break;
        }

        if(extName.length == 0){
            res.locals.error = '只支持png和jpg格式图片';
            var images = req.session.images;
            res.render('upload/image', {title: '图片上传',images:images});
            return;
        }

        var avatarName = uuid.v1() + '.' + extName;
        var newPath = form.uploadDir + avatarName;
        var path = '/upload/image/'+ avatarName;
        var images = req.session.images || [];
        images.push(path);
        req.session.images = images;
        fs.renameSync(files.fulAvatar.path, newPath);  //重命名
        req.flash('success','上传成功');
        res.redirect('/upload/image');

    });


});
module.exports = router;