# Kongo
[![Build Status](https://api.travis-ci.org/rschmukler/kongo.png)](http://travis-ci.org/rschmukler/kongo) 
[![Coverage
Status](https://coveralls.io/repos/rschmukler/kongo/badge.png)](https://coveralls.io/r/rschmukler/kongo)

Implementation of [mongodb](https://github.com/mongodb/node-mongodb-native) that
works well with [co](https://github.com/visionmedia/co).


## Example Usage

Connecting to a database

```js
var Kongo = require('kongo');

var db = yield Kongo.Client.connect('mongodb://localhost:27017/kongo');

var Users = db.collection('Users');
```

Some Collection Examples (Full documentation to come)

```js
users = yield Users.find({}, {sort: ['createdAt', -1], limit: 10});

newUser = yield Users.insert({name: 'Ryan'});
newUser._id // Some id set by mongo

anotherUser = yield Users.save({name: 'Matt'});
anotherUser.name = 'Matthew';
yield Users.save(anotherUser);
mattCount = yield User.count({name: 'Matthew'});
mattCount == 1; // true
```

## License
(The MIT License)

Copyright (c) 2013 Ryan Schmukler ryan@slingingcode.com

Permission is hereby granted, free of charge, to any person obtaining a copy of
this software and associated documentation files (the 'Software'), to deal in
the Software without restriction, including without limitation the rights to
use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of
the Software, and to permit persons to whom the Software is furnished to do so,
subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS
FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR
COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER
IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
