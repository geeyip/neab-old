var express = require('express');
var router = express.Router();
var formidable = require('formidable');
var uuid = require('node-uuid');
var fs = require('fs');
router.post('/', function(req, res){
    var form = new formidable.IncomingForm();   //创建上传表单
    form.encoding = 'utf-8';		//设置编辑
    form.uploadDir = 'public/upload/';	 //设置上传目录
    form.keepExtensions = true;	 //保留后缀
    form.maxFieldsSize = 2 * 1024 * 1024;   //文件大小

    form.parse(req, function(err, fields, files) {
        if (err) {
            res.send('上传失败');
            return;
        }
        //后缀名
        var extName = files.upload.name.split('.')[1];
        var avatarName = uuid.v1() + '.' + extName;
        var newPath = form.uploadDir + avatarName;

        console.log(newPath);
        fs.renameSync(files.upload.path, newPath);  //重命名
        var result = '';
        var path = 'http://192.168.1.168:3131/upload/'+avatarName;
        console.log(path);
        var callback = req.query.CKEditorFuncNum;
        result += "<script type=\"text/javascript\">";
        result += "window.location.href='http://127.0.0.1:8040/dist/view/uploaded.html?src="+path+"'";

        //result += "window.parent.CKEDITOR.tools.callFunction(" + callback + ", '" + path + "','')";
        //result += "console.log(window);console.log('"+path+"')";
        result += "</script>";
        console.log(result);
        res.send(result);
    });
});

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