var redis = require('redis');



/**
 * Redis client
 */

var rcli = redis.createClient();

rcli.on('end', function () {
  rcli = redis.createClient();
});


/**
 * Redis key
 */

function getKey (options) {
  return 'limiter:' + options.action + ':' + options.identifier;
}


/**
 * check
 */

exports.check = function (options, callback) {

  options = options || {};

  if (!options.action) return callback(new Error('action required'));
  if (!options.identifier) return callback(new Error('identifier required'));
  if (!options.limit) return callback(new Error('limit required'));

  var key = getKey(options);

  rcli.get(key, function (err, reply) {
    if (err) return callback(err);
    
    callback(null, reply >= options.limit);

  });

};


/**
 * global check
 */

exports.globalCheck = function (options, callback) {

  options = options || {};

  if (!options.action) return callback(new Error('action required'));
  if (!options.limit) return callback(new Error('limit required'));
  if (!options.during) return callback(new Error('during required'));

  options.identifier = '*';
  var patternKey = getKey(options);

  rcli.keys(patternKey, function (err, results) {
    if (err) return callback(err);

    callback(null, results.length >= options.limit);

  });

};


/**
 * incr
 */

exports.incr = function (options, callback) {

  options = options || {};

  if (!options.action) return callback(new Error('action required'));
  if (!options.identifier) return callback(new Error('identifier required'));
  if (!options.during) return callback(new Error('during required'));

  var key = getKey(options);

  rcli.incr(key, function (err, reply) {
    if (err) return callback(err);

    if (reply == 1) {

      rcli.expire(key, options.during, function (err, done) {
        if (err) return callback(err);

        callback();

      });

    } else callback();

  });

};
