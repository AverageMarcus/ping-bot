'use strict';
const url = require('url');
const https = require('https');

const Hapi = require('hapi');
const server = new Hapi.Server();
server.connection({ port: process.env.PORT || 3000 });

server.route({
  method: 'GET',
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
  method: 'GET',
  path: '/tableflip',
  handler: (request, reply) => {
    var parsed = url.parse(request.url, true);
    var echoChannel = parsed.query.channel_id;
    var slackURL = url.parse(parsed.query.response_url);

    let output = JSON.stringify({
      channel: echoChannel,
      response_type: "in_channel",
      text: 'Test',
      as_user: true,
      attachments: []
    });

    var options = {
      host: slackURL.host,
      method: 'POST',
      path: slackURL.path,
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': output.length
      }
    };
    var post = https.request(options, function(res) {
      res.setEncoding('utf8');
      res.on('data', function(chunk) {
        console.log('response', chunk);
      });
    });

    post.write(output);
    post.end();

    reply(JSON.stringify({
        response_type: "in_channel"
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