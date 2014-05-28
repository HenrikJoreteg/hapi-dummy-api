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
var config = require('getconfig');
var server = new Hapi.Server('localhost', config.http.port);

// require our dummy API generator
var API = require('hapi-dummy-api');


// all these config items are optionals
var tempAPI = new API({
    // Optionally give it some starting data (should be an array)
    // defaults to [];
    data: [
        {
            id: 0,
            name: 'mary'
        },
        {
            id: 1,
            name: 'bob'
        }
    ],
    // the root RESTful resource URL
    rootUrl: '/api/people',
    // specify which property name should be the "id"
    // defaults to "id"
    idProperty: 'id',
    // Optionally give it a delay (in milliseconds) to simulate network latency
    // as you'd have in real clientapp situation.
    delay: 200,
    // hapi plugin name, defaults to 'api'
    name: 'fake-people-api',
    // hapi plugin version, defaults to '0.0.0',
    version: '0.0.1'
});


server.pack.register(fakeApi, function (err) {
    if (err) throw err;
    // If everything loaded correctly, start the server:
    server.start(function (err) {
        if (err) throw err;
        console.log("running at: http://localhost:" + config.http.port + ");
    });
});
```

## additional info

There's really not much more to it, the source is < 100 lines and should be quite readable. 

This is meant for development only, obviously. It would be the worlds most terrible and insecure production API. Please don't use it for that. Use it to aid development of client apps.


## credits

If you like this follow [@HenrikJoreteg](http://twitter.com/henrikjoreteg) on twitter.

## license

MIT

