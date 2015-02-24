# limiter

## How to use

```javascript
var limiter = require('limiter');

var options_limiter = {
  action: 'signup',
  identifier: req.connection.remoteAddress,
  limit: 2,
  during: 10 * 60 // 10 minutes
};

limiter.check(options_limiter, function (err, isLimited) {

  // is limited when the user signed up more or equal than 2 registrations for 10 minutes

});

limiter.incr(options_limiter, function (err) {

  // increment the counter for the user

});

var options_global_limiter = {
  action: 'signup',
  limit: 1000,
  during: 10 * 60 // 10 minutes
};

limiter.globalCheck(options_global_limiter, function (err, isLimited) {
  
  // is limited when there is more or equal than 1000 registrations for 10 minutes

});

```
