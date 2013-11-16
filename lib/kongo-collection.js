var thunkify = require('thunkify');

var simpleCallbacks = [
  'drop',
  'remove',
  'rename',
  'distinct',
  'count'
];

var stripExtras = [
  'update'
];

var convertSingularArrays = [
  'insert'
];

var cursorMethods = [
  'find',
  'findAndRemove'
];


module.exports = function(collection) {
  simpleCallbacks.forEach(function(method) {
    collection[method] = thunkify(collection[method]);
  });

  stripExtras.forEach(function(method) {
    var original = collection[method];
    collection[method] = function() {
      var args = Array.prototype.slice.call(arguments);
      return function(done) {
        args.push(function(err, first) {
          if(err) return done(err);
          return done(null, first);
        });
        original.apply(collection, args);
      };
    };
  });

  convertSingularArrays.forEach(function(method) {
    var original = collection[method];
    collection[method] = function() {
      var args = Array.prototype.slice.call(arguments);
      return function(done) {
        args.push(function(err, res) {
          if(err) return done(err);
          if(res.length == 1) return done(null, res[0]);
          return done(null, res);
        });
        original.apply(collection, args);
      };
    };
  });

  cursorMethods.forEach(function(method) {
    var original = collection[method];
    collection[method] = function(query, options) {
      options = options || {};
      return function(done) {
        original.call(collection, query)
          .limit(options.limit)
          .batchSize(options.batchSize)
          .skip(options.skip)
          .sort(options.sort)
          .toArray(done);
      };
    };
  });

  collection.findOne = function(query, options) {
    return function(done) {
      options = options || {};
      options.limit = -1;
      options.batchSize = 1;
      collection.find(query, options)(function(err, res) {
        if(err) done(err);
        else done(null, res[0]);
      });
    };
  };

  var findAndModify = collection.findAndModify;
  collection.findAndModify = function(query, sort, update, options) {
    options = options || {};
    return function(done) {
      if(options.new !== false) options.new = true;
      findAndModify.call(query, sort, update, options, done);
    };
  };

  collection.save = function(doc, options) {
    return function(done) {
      options = options || {};

      if(doc._id) {
        options.upsert = true;
        collection.update({_id: doc._id}, doc, options)(done);
      } else {
        collection.insert(doc, options)(done);
      }

    }
  };
};
