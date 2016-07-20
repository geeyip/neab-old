
/**
 * 路由配置入口
 * @param app
 */
module.exports = function(app){

    app.use('/api/client', require('./client/index'));

    app.use('/api/upload', require('./upload/upload'));

}