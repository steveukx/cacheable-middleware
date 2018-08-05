cacheable-middleware
====================

Middleware component to set cache headers on responses from an Express or Connect server.

Installation
============

Install as an NPM module:

    npm install cacheable-middleware

Usage
=====

The cacheable middleware can be used in two ways - by adding it to the express or connect server, the response will
add a new method `cacheFor( millisecondsDuration )` that will add the cache headers to cache this particular response
for the specified number of milliseconds.

    // add cache middleware to add cacheFor method to responses
    app.use(require('cache-middleware')());

    // add a route that sends a file and sets headers to cache for one day
    app.get('/', function(req, res) {
       res.cacheFor(86400000).sendfile(__dirname + '/index.html');
    });

    // add a route that sends a file and sets headers to cache for six months
    app.get('/long-cache', function(req, res) {
       res.cacheFor(6, 'months').sendfile(__dirname + '/index.html');
    });

To automatically set the cache headers for a particular duration for a path, set the duration when the middleware is
added:

    // add cache middleware to add cacheFor method to responses
    // and default the cache headers on each response to one day
    app.use('/static', require('cache-middleware')(86400000));

    // alternative syntax
    app.use('/static', require('cache-middleware')(1 'day'));

Duration Syntax
===============

For conveninece, durations can be supplied as any arguments that can be received by [Moment.js](http://momentjs.com/docs/).

Breaking Changes
================

Upgrading to version 1.x requires node >= 6 to support the use of ES6
