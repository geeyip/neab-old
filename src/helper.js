
/**
 * Module dependencies.
 */

var url = require('url');
var qs = require('querystring');
var _ = require('underscore');

module.exports = function(app, name){

  app.use(function(req, res , next){
    res.locals.appName = name || 'App';
    res.locals.req = req;
    res.locals.user = req.user;
    if (typeof req.flash !== 'undefined') {
      res.locals.info = req.flash('info');
      res.locals.error = req.flash('error');
      res.locals.success = req.flash('success');
      res.locals.warning = req.flash('warning');
    }
    if(req.path == '/login' && req.method == 'POST'){
      req.flash('username', req.body.username);
    }
    res.locals.createPagination = function(pages, page){
      if(pages < 2){
        return '';
      }
      if(pages >100){
        pages = 100;
      }
      var params = qs.parse(url.parse(req.url).query)
      var str = '<ul class="pagination">';
      params.page = 1;
      var clas = page == 1 ? "active" : "no";

      //str += '<li class="no"><a href="?'+qs.stringify(params)+'">首页</a></li>';

      if(pages>0&&page>1){
        str += '<li class="no"><a href="'+res.locals.paginate.href(true) +'">上一页</a></li>'
      }else{
        str += '<li class="no disabled"><a href="">上一页</a></li>'
      }

      var startAbs = 0;
      var start = 0;
      var endAbs = 0;
      var end = 0;
      if(pages>10){

        start = page-5;
        if(start<=0){
          startAbs = Math.abs(start);
          start = 1;
        }else{
          startAbs = 0;
        }

        end = page+4;
        if(end>pages){
          endAbs = Math.abs(pages-end);
          end = pages;
        }else{
          endAbs = 0;
        }

        if(startAbs>0){
          end = end+startAbs;
        }
        if(endAbs>0){
          start = start-endAbs;
        }

      }else{
        start = 1;
        end = pages;

      }
      for (var p = start; p <=end; p++) {
        params.page = p;
        clas = page == p ? "active" : "no"
        var href = '?' + qs.stringify(params)
        str += '<li class="'+clas+'"><a href="'+ href +'">'+ p +'</a></li>'
      }


      if(pages>0&&page<pages){
        str += '<li class="no"><a href="'+res.locals.paginate.href() +'">下一页</a></li>'
      }else{
        str += '<li class="no disabled"><a href="">下一页</a></li>'
      }

      params.page = pages;

     // str += '<li class="no"><a href="?'+qs.stringify(params)+'">末页</a></li></ul>';

      return str
    }
    next();
  });
}
