#!/usr/bin/env bash

param=$1
if [ "x$param" = "x" ]; then
    param=patch
fi

# Create a new tag to keep track of all changes since last release
COMMIT_MESSAGES=$(git log `git describe --tags --abbrev=0 HEAD^`..HEAD --oneline)
TAG_MESSAGE=$(printf "\n${COMMIT_MESSAGES}")
VERSION=$(npm version $param --message "Version %s ${TAG_MESSAGE}")

git push --tags
npm publish
