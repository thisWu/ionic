#!/bin/bash

ROLLUP_CONFIG=__rollup.config.js
ROLLUP_OUTPUT=__rollup-output.js
CLOSURE_OUTPUT=__closure-output.js
GZIP_OUTPUT=__gzip-output.gz

echo rollup
node ./node_modules/.bin/rollup -c $ROLLUP_CONFIG -o $ROLLUP_OUTPUT

# echo closure
# java -jar ../closure/compiler.jar --compilation_level ADVANCED_OPTIMIZATIONS --js $ROLLUP_OUTPUT --js_output_file $CLOSURE_OUTPUT

# echo gzip
# gzip -c $CLOSURE_OUTPUT > $GZIP_OUTPUT

echo $(du -h $ROLLUP_OUTPUT)
# echo $(du -h $CLOSURE_OUTPUT)
# echo $(du -h $GZIP_OUTPUT)
