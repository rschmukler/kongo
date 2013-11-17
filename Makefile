MOCHA_PATH = ./node_modules/mocha/bin/mocha

test:
	NODE_ENV=test $(MOCHA_PATH) --reporter=spec --harmony -w

test-once:
	NODE_ENV=test $(MOCHA_PATH) --reporter=spec --harmony

test-debug:
	NODE_ENV=test $(MOCHA_PATH) --reporter=spec --harmony debug

test-coverage:
	NODE_ENV=test KONGO_COVERAGE=1 $(MOCHA_PATH) --require blanket --reporter html-cov --harmony > coverage.html

test-coveralls:
	NODE_ENV=test KONGO_COVERAGE=1 $(MOCHA_PATH) --require blanket --reporter mocha-lcov-reporter --harmony | ./node_modules/coveralls/bin/coveralls.js

.PHONY: test test-once test-debug test-coverage test-coveralls
