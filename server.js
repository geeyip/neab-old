#!/usr/bin/env node

/**
 * Module dependencies.
 */

var app = require('./core/app-express');
var debug = require('debug')('neab:server');
var http = require('http');
var socket = require('./socket/onlineSocket');

/**
 * Get port from environment and store in Express.
 */

var port = normalizePort(process.env.PORT || '3000');

/**
 * Create HTTP server.
 */

var server = http.createServer(app);

/**
 * Listen on provided port, on all network interfaces.
 */

server.listen(port, function(){
  console.log('Express server listening on port ' + server.address().port );
});

socket(server);

server.on('error', onError);
server.on('listening', onListening);


process.on('uncaughtException', function (err) {
  console.log(err);
  console.log(err.stack);
});
/**
 * Normalize a port into a number, string, or false.
 */

function normalizePort(val) {
  var port = parseInt(val, 10);

  if (isNaN(port)) {
    // named pipe
    return val;
  }

  if (port >= 0) {
    // port number
    return port;
  }

  return false;
}

/**
 * Event listener for HTTP server "error" event.
 */

function onError(error) {
  if (error.syscall !== 'listen') {
    throw error;
  }

  var bind = typeof port === 'string'
    ? 'Pipe ' + port
    : 'Port ' + port;

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges');
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(bind + ' is already in use');
      process.exit(1);
      break;
    default:
      throw error;
  }
}

/**
 * Event listener for HTTP server "listening" event.
 */

function onListening() {
  var addr = server.address();
  var bind = typeof addr === 'string'
    ? 'pipe ' + addr
    : 'port ' + addr.port;
  debug('Listening on ' + bind);
}
