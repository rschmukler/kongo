test:
	./node_modules/mocha/bin/mocha --reporter=spec --harmony -w

test-once:
	./node_modules/mocha/bin/mocha --reporter=spec --harmony

test-debug:
	./node_modules/mocha/bin/mocha --reporter=spec --harmony debug

.PHONY: test test-once
