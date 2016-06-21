
/**
 * Module dependencies.
 */

var url = require('url');
var qs = require('querystring');
var _ = require('underscore');

function helpers (name) {
  return function (req, res, next) {
    res.locals.appName = name || 'App';
    res.locals.title = name || 'App';
    res.locals.req = req;
    res.locals.isActive = function (link) {
      if (link === '/' ) {
        return req.url === '/' ? 'active' : '';
      } else {
        return req.url.indexOf(link) !== -1 ? 'active' : '';
      }
    }
    res.locals.formatDate = formatDate;
    res.locals.formatDatetime = formatDatetime;
    res.locals.stripScript = stripScript;
    res.locals.createPagination = createPagination(req);

    if (typeof req.flash !== 'undefined') {
      res.locals.info = req.flash('info');
      res.locals.error = req.flash('error');
      res.locals.success = req.flash('success');
      res.locals.warning = req.flash('warning');
    }

    if(req.path == '/login' && req.method == 'POST'){
      req.flash('username', req.body.username);
    }
    next();
  }
}

module.exports = helpers;

/**
 * Pagination helper
 *
 * @param {Number} pages
 * @param {Number} page
 * @return {String}
 * @api private
 */

function createPagination (req) {
  return function createPagination(pages, page) {

    var params = qs.parse(url.parse(req.url).query);
    var str = '<ul class="pagination">';
    params.page = 1;
    var clas = page == 1 ? "active" : "no";
    for (var p = 1; p <= pages; p++) {
      params.page = p;
      clas = page == p ? "active" : "no";
      var href = '?' + qs.stringify(params);
      str += '<li class="'+clas+'"><a href="'+ href +'">'+ p +'</a></li>';
    }
    str += '</ul>';
    return str
  }
}

/**
 * Format date helper
 *
 * @param {Date} date
 * @return {String}
 * @api private
 */

function formatDate (date) {
  date = new Date(date);
  var monthNames = [ 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'June', 'July', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec' ];
  return monthNames[date.getMonth()]+' '+date.getDate()+', '+date.getFullYear();
}

/**
 * Format date time helper
 *
 * @param {Date} date
 * @return {String}
 * @api private
 */

function formatDatetime (date) {
  date = new Date(date);
  var hour = date.getHours();
  var minutes = date.getMinutes() < 10
    ? '0' + date.getMinutes().toString()
    : date.getMinutes();

  return formatDate(date) + ' ' + hour + ':' + minutes;
}

/**
 * Strip script tags
 *
 * @param {String} str
 * @return {String}
 * @api private
 */

function stripScript (str) {
  return str.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
}
