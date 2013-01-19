/**
 * @exports Cacheable
 */
(function () {

   "use strict";

   var Moment = require('moment');

   /**
    * Configure the cacheable middleware with a default duration to cache responses for in the client browser, supplying
    * zero or an undefined value will not add headers automatically, but the `cacheFor` method will still be available
    * on the response object.
    *
    * The function accepts any number of arguments that would be accepted by the Moment.js duration method to describe
    * a time frame. For example:
    *
    * @example
    * app.use(require('cacheable-middleware')( 86400000 )); // cache all responses for one day
    *
    * @example
    * app.use(require('cacheable-middleware')( 1, 'day' )); // cache all responses for one day
    *
    * @example
    * app.use(require('cacheable-middleware')( 6, 'months' )); // cache all responses for 6 months
    *
    * @see http://momentjs.com/docs/#/durations/
    *
    * @name Cacheable
    * @param {Number|String|Object} duration
    * @function
    */
   function Cacheable(duration) {
      if(!duration) {
         return Cacheable.cachedResponse.bind(this, null);
      }

      if(!Moment.isDuration(duration)) {
         duration = Moment.duration.apply(Moment, arguments);
      }

      return Cacheable.cachedResponse.bind(this, duration.asMilliseconds());
   }

   /**
    *
    * @param {Number} ms
    * @param {http.ServerRequest} req
    * @param {http.ServerResponse} res
    * @param {Function} next
    */
   Cacheable.cachedResponse = function(ms, req, res, next) {
      res.cacheFor = Cacheable.cacheFor;
      ms && res.cacheFor(ms);
      next();
   };

   /**
    *
    * @param {Number} ms
    * @return {http.ServerResponse}
    */
   Cacheable.cacheFor = function(ms) {
      var duration = (Moment.isDuration(ms)) ? ms : Moment.duration.apply(Moment, arguments);
      var then  = Moment().add(duration);

      this.set('Expires', then.toDate().toUTCString());
      this.set('Last-Modified', (new Date).toUTCString());
      this.set('Cache-Control', 'max-age=' + duration.asMilliseconds());
      return this;
   };

   module.exports = Cacheable;

}());
