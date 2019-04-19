#! /usr/bin/env bash

# Shameless lift from https://prettier.io/docs/en/precommit.html

jsfiles=$(git diff --cached --name-only --diff-filter=ACM "*.js" "*.jsx" | tr '\n' ' ')
[ -z "$jsfiles" ] && exit 0

# Prettify all staged .js files
echo "$jsfiles" | xargs ./node_modules/.bin/prettier --write --no-semi

# Add back the modified/prettified files to staging
echo "$jsfiles" | xargs git add

exit 0
