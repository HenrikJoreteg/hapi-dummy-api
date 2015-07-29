# hapi-dummy-api

Generate dummy APIs for hapi.js, for building clientside apps before the real API is done.

Don't wait for the real thing to be done before you get started building the client app.

This util lets you generate little dummy APIs that can be registered as hapi plugins for a hapi.js server.


## install

```
npm install hapi-dummy-api
```

## example

```javascript
var Hapi = require('hapi');
var server = new Hapi.Server();
var dummyAPI = require('hapi-dummy-api');

server.connection({
  port: 3000
});

// all these config items are optionals
var peopleOptions = {
    // Optionally give it some starting data (should be an array)
    // defaults to [];
    data: [{
        id: 0,
        name: 'mary'
    }, {
        id: 1,
        name: 'bob'
    }],
    // the root RESTful resource URL
    rootUrl: '/api/people',
    // specify which property name should be the "id"
    // defaults to "id"
    idProperty: 'id',
    // Optionally give it a delay (in milliseconds) to simulate network latency
    // as you'd have in real clientapp situation.
    delay: 200
};

// here is a second resource
var thingsOptions = {
    data: [{
        id: 0,
        name: 'chair'
    }],
    rootUrl: '/api/things'
};

server.register(
    // register the plugin twice with both of our configs
    [{
        register: dummyAPI,
        options: peopleOptions
    }, {
        register: dummyAPI,
        options: thingsOptions
    }],
    function (err) {
        if (err) throw err;
        server.start(function (err) {
            if (err) throw err;
            console.log("running at: ", server.info.uri);
        });
    }
);
```

## additional info

There's really not much more to it, the source is < 100 lines and should be quite readable.

This is meant for development only, obviously. It would be the worlds most terrible and insecure production API. Please don't use it for that. Use it to aid development of client apps.

### CORS

Example CORS configuration for all routes by default:

```
server.connection({
  port: 3000,
  routes: {
    cors: {
      additionalHeaders: ['X-Auth-Token']
    },
    jsonp: 'callback'
  }
});
```

## credits

Created by [@HenrikJoreteg](http://twitter.com/henrikjoreteg).

Big thanks to @Flet for his work on keeping it up to date and adding tests.

## license

MIT

