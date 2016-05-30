'use strict';
const Hapi = require('hapi');
const server = new Hapi.Server();
server.connection({ port: process.env.PORT || 3000 });

server.route({
  method: 'POST',
  path: '/ping',
  handler: (request, reply) => {
    reply(JSON.stringify({
        response_type: "in_channel",
        text: 'Pong!'
      }))
      .header('Content-Type', 'application/json');
  }
});

server.start((err) => {
  if (err) {
    throw err;
  }
  console.log('Server running at:', server.info.uri);
});