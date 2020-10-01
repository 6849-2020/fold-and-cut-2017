INPUTS=$(wildcard coffees/*.coffee)
OUTPUTS=$(INPUTS:coffees/%.coffee=js/%.js)
$(info Input files: $(INPUTS))

COFFEE := $(shell command -v coffee 2> /dev/null)

SHELL := /bin/bash

all : huh.js

huh.js : $(OUTPUTS)
	cat js/classdefs.js js/function*.js js/geometry.js js/geometryCreasePattern.js js/orientationfunctions.js js/notJquery.js js/jqueries.js > huh.js

js/%.js : coffees/%.coffee
ifndef COFFEE
	ruby compile-coffee.rb $< > $@
else
	coffee -b -o js/ -c $<
endif

clean :
	rm js/*.js
	rm huh.js
