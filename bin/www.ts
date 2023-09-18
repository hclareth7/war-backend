#!/usr/bin/env node

/**
 * Module dependencies.
 */

import app from '../src/app';
import debug from 'debug';
debug('war-backend:server');
import http from 'http';
import dotenv from 'dotenv';
dotenv.config();

/**
 * Get port from environment and store in Express.
 */

let port = normalizePort(process.env.APP_PORT || '3000');
app.set('port', port);

/**
 * Create HTTP server.
 */

let server = http.createServer(app);

/**
 * Listen on provided port, on all network interfaces.
 */

server.listen(port);
server.on('error', onError);
server.on('listening', onListening);

/**
 * Normalize a port into a number, string, or false.
 */

function normalizePort(val) {
  let port = parseInt(val, 10);

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

  let bind = typeof port === 'string'
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
  let addr = server.address();
  let bind = typeof addr === 'string'
    ? 'pipe ' + addr
    : 'port ' + addr?.port;
 console.log(`
                                                        lllllll          tttt
                                                        l:::::l       ttt:::t
                                                        l:::::l       t:::::t
                                                        l:::::l       t:::::t
   qqqqqqqqq   qqqqquuuuuu    uuuuuu    aaaaaaaaaaaaa    l::::l ttttttt:::::ttttttt    yyyyyyy           yyyyyyy
  q:::::::::qqq::::qu::::u    u::::u    a::::::::::::a   l::::l t:::::::::::::::::t     y:::::y         y:::::y
 q:::::::::::::::::qu::::u    u::::u    aaaaaaaaa:::::a  l::::l t:::::::::::::::::t      y:::::y       y:::::y
q::::::qqqqq::::::qqu::::u    u::::u             a::::a  l::::l tttttt:::::::tttttt       y:::::y     y:::::y
q:::::q     q:::::q u::::u    u::::u      aaaaaaa:::::a  l::::l       t:::::t              y:::::y   y:::::y
q:::::q     q:::::q u::::u    u::::u    aa::::::::::::a  l::::l       t:::::t               y:::::y y:::::y
q:::::q     q:::::q u::::u    u::::u   a::::aaaa::::::a  l::::l       t:::::t                y:::::y:::::y
q::::::q    q:::::q u:::::uuuu:::::u  a::::a    a:::::a  l::::l       t:::::t    tttttt       y:::::::::y
q:::::::qqqqq:::::q u:::::::::::::::uua::::a    a:::::a l::::::l      t::::::tttt:::::t        y:::::::y
 q::::::::::::::::q  u:::::::::::::::ua:::::aaaa::::::a l::::::l      tt::::::::::::::t         y:::::y
  qq::::::::::::::q   uu::::::::uu:::u a::::::::::aa:::al::::::l        tt:::::::::::tt        y:::::y
    qqqqqqqq::::::q     uuuuuuuu  uuuu  aaaaaaaaaa  aaaallllllll          ttttttttttt         y:::::y
            q:::::q                                                                          y:::::y
            q:::::q                                                                         y:::::y
           q:::::::q                                                                       y:::::y
           q:::::::q                                                                      y:::::y
           q:::::::q                                                                     yyyyyyy
           qqqqqqqqq
           
           server running on port ${process.env.APP_PORT}
           `);
}
