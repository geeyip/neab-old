var express = require('express');
var router = express.Router();
var formidable = require('formidable');
var uuid = require('node-uuid');
var fs = require('fs');
var path = require('path');

router.post('/', function(req, res) {
    console.log(req.headers.host);
    var form = new formidable.IncomingForm();   //创建上传表单
    form.encoding = 'utf-8';		//设置编辑
    form.uploadDir = 'public/upload/';	 //设置上传目录
    form.keepExtensions = true;	 //保留后缀
    form.maxFieldsSize = 2 * 1024 * 1024;   //文件大小

    form.parse(req, function (err, fields, files) {
        console.log(req.headers.host);
        if (err) {
            res.send('上传失败');
            return;
        }
        //后缀名
        var extName = files.upload.name.split('.')[1];
        var avatarName = uuid.v1() + '.' + extName;
        var newPath = form.uploadDir + avatarName;

        fs.renameSync(files.upload.path, newPath);  //重命名
        var result = '';
        var path = 'http://'+req.headers.host+'/upload/' + avatarName;
        var callback = req.query.CKEditorFuncNum;

        var host = req.query.host;
        var port = req.query.port;

        res.redirect("http://" + host + ":" + port + "/dist/view/uploaded.html?src=" + path + "&fnID=" + callback);

    });
});

//保存base64图片POST方法
router.post('/base64', function(req, res){
    //接收前台POST过来的base64
    var base64Data = req.body.imgData;
    var imgName = uuid.v1()+".png";
    //过滤data:URL
    //imgData = "data:image/png;base64,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";
    //var base64Data = imgData.replace(/^data:image\/\w+;base64,/, "");
    var dataBuffer = new Buffer(base64Data, 'base64');
    fs.writeFile(path.join("public","upload", imgName), dataBuffer, function(err) {
        if(err){
            console.log(err);
            res.send(err);
        }else{
            var newPath = 'http://'+req.headers.host+'/upload/' + imgName;
            res.send(newPath);
        }
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