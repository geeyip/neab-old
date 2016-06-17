/**
 * 路由配置入口
 * @param app
 */
module.exports = function(app){
    app.use('/', require('./index'));
    app.use('/users', require('./users'));
    app.use('/roles', require('./roles'));
    app.use('/resources', require('./resources'));
    app.use('/profile', require('./profile'));
}