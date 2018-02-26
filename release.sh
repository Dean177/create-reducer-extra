#!/usr/bin/env bash

VERSION_MODIFIER=$1
if [ "x$VERSION_MODIFIER" = "x" ]; then
    VERSION_MODIFIER=patch
fi

# Create a new tag to keep track of all changes since last release
COMMIT_MESSAGES=$(git log `git describe --tags --abbrev=0 HEAD^`..HEAD --oneline)
TAG_MESSAGE=$(printf "\n${COMMIT_MESSAGES}")
VERSION=$(yarn version ${VERSION_MODIFIER} --message "Version %s ${TAG_MESSAGE}")

git push --tags
yarn publish
