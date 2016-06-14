var flash = require('connect-flash');

/**
 * 页面提示
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
        next();
    });
}