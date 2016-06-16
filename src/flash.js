var flash = require('connect-flash');

/**
 * 页面提示及信息传递
 * @param app
 */
module.exports = function(app){
    app.use(flash());
    app.use(function(req, res, next) {
        res.locals.user = req.user;
        res.locals.info =  req.flash('info');
        res.locals.error = req.flash('error');
        res.locals.success = req.flash('success');
        res.locals.warning = req.flash('warning');

        if(req.path == '/login' && req.method == 'POST'){
            req.flash('username', req.body.username);
        }

        next();

    });
}