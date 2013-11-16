/* jshint esnext: true */

var expect = require('expect.js'),
    co = require('co'),
    mongo = require('mongodb'),
    kongo = require('..');

describe('Kongo', function() {
  var collection, db;
  before(function(done) {
    mongo.MongoClient.connect('mongodb://localhost:27017/kongo', function(err, aDb) {
      db = aDb;
      if(err) throw(err);
      collection = db.collection('People');
      kongo.collectionWrapper(collection);
      collection.drop(function() {
        db.createCollection('People', function(err) {
          done();
        });
      });
    });
  });

  describe('Collection Wrapper', function() {

    describe('Management', function() {
      describe('drop', function() {
        it('drops the collection', function(done) {
          co(function *() {
            var dropped = yield collection.drop();
            expect(dropped).to.be(true);
            db.createCollection('People', function(err) {
              done(err);
            });
          })();
        });
      });

      describe('rename', function() {
        it('renames the collection', function(done) {
          co(function *() {
            yield collection.rename('NewName');
            expect(collection.collectionName).to.be('NewName');
            yield collection.rename('People');
          })(done);
        });
      });
    });

    describe('modification', function() {
      describe('insert', function() {
        it('inserts a document', function(done) {
          co(function *() {
            var inserted = yield collection.insert([{name: 'Testing', age: 100}, {name: 'AnotherTest', age: 50}]);
            expect(inserted).to.have.length(2);
            var doc = inserted[0];
            expect(doc).to.have.property('name', 'Testing');
            expect(doc).to.have.property('_id');
            done();
          })();
        });
        it('gives a singular document back if just one was inserted', function(done) {
          co(function *() {
            var newDoc = yield collection.insert({name: 'Ryan', age: 23});
            expect(newDoc).to.have.property('name', 'Ryan');
            done();
          })();
        });
      });

      describe('remove', function() {
        it('removes a document', function(done) {
          co(function *() {
            var newDoc = yield collection.save({name: 'GonnaGet Removed'});
            var remCount = yield collection.remove(newDoc);
            expect(remCount).to.be(1);
            var found = yield collection.findOne({name: 'GonnaGet Removed'});
            expect(found).to.be(undefined);
          })(done);
        });
      });

      describe('update', function() {
        it('updates the document', function(done) {
          co(function *() {
            var inserted = yield collection.insert({name: 'Inserted'});
            var updated = yield collection.update({_id: inserted._id}, {name: 'Updated'});
            expect(updated).to.be(1);
            updated = yield collection.findOne({name: 'Updated'});
            expect(updated).to.be.ok();
          })(done);
        });
      });

      describe('save', function() {
        it('creates a new document', function(done) {
          co(function *() {
            var newDoc = {name: 'New Doc'};
            var res = yield collection.save(newDoc);
            expect(res).to.have.property('_id');
            newDoc = yield collection.findOne({name: 'New Doc'});
            expect(newDoc).to.be.ok();
          })(done);
        });
        it('updates an existing document', function(done) {
          co(function *() {
            var newDoc = {name: 'UpdateMe'};
            newDoc = yield collection.insert(newDoc);
            newDoc.name = 'Been Updated';
            var result = yield collection.save(newDoc);
            expect(result).to.be(1);
            var updated = yield collection.findOne(newDoc._id);
            expect(updated).to.have.property('name', 'Been Updated');
          })(done);
        });
      });
    });

    describe('Queries', function() {
      describe('count', function() {
        it('returns the count', function(done) {
          co(function *() {
            var count = yield collection.count();
            expect(count).to.be.greaterThan(0);
          })(done);
        });
      });
      describe('find', function() {
        it('returns documents matching the query', function(done) {
          co(function *() {
            var users = yield collection.find({name: 'Ryan'});
            expect(users).to.have.length(1);
            var user = users[0];
            expect(user).to.have.property('name', 'Ryan');
            expect(user).to.have.property('age', 23);
          })(done);
        });
        
        it('lets you use limit', function(done) {
          co(function *() {
            var users = yield collection.find({}, {limit: 2});
            expect(users).to.have.length(2);
          })(done);
        });

        it('lets you use skip', function(done) {
          co(function *() {
            var results = yield [collection.find({}, {limit: 2}), collection.find({}, {skip: 1, limit: 2})];
            var firstUsers = results[0],
                skipped    = results[1];
            expect(firstUsers[1].name).to.be(skipped[0].name);
          })(done);
        });

        it('lets you use sort', function(done) {
          co(function *() {
            var users = yield collection.find({}, {limit: 1, sort: {age: -1}});
            expect(users[0]).to.have.property('age', 100);
          })(done);
        });
      });

      describe('findOne', function() {
        it('returns a single record', function(done) {
          co(function *() {
            var ryan = yield collection.findOne({name: 'Ryan'});
            expect(ryan).to.have.property('age', 23);
          })(done);
        });
      });

      describe('destinct', function() {
        it('returns the distinct items', function(done) {
          co(function *() {
            var distinctCount = (yield collection.distinct('name')).length;
            yield collection.insert({name: 'A Really Unique Name'});
            var newDistinctCount = (yield collection.distinct('name')).length;
            expect(newDistinctCount).to.be(distinctCount + 1);
          })(done);
        });
      });
    });

    describe('Indexes', function() {
      //TODO
    });

    describe('Aggregations', function() {
      //TODO
    });

    describe('GeoQueries', function() {
      //TODO
    });
  });
});
