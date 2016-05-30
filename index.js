'use strict';
const url = require('url');
const https = require('https');

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

server.route({
  method: 'POST',
  path: '/tableflip',
  handler: (request, reply) => {
    console.log(request.payload);
    console.log(typeof request.payload);

    let slackURL = url.parse(request.payload.response_url);
    let echoChannel = request.payload.channel_id;
    let usersText = request.payload.text.trim();

    let output = JSON.stringify({
      token: request.payload.token,
      channel: request.payload.channel_id,
      text: `${usersText} ()`,
      as_user: true
    });

    let options = {
      host: 'slack.com',
      path: '/api/chat.postMessage',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': output.length
      }
    };
    let post = https.request(options, function(res) {
      res.setEncoding('utf8');
      res.on('data', function(chunk) {
        console.log('response', chunk);
      });
    });

    post.write(output);
    post.end();

    reply();
  }
});

server.start((err) => {
  if (err) {
    throw err;
  }
  console.log('Server running at:', server.info.uri);
});