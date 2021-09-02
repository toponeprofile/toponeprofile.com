#!/bin/bash

./generate.sh

# Set user  
git config --local credential.helper ""
git config --local user.name "toponeprofile"
git config --local user.email "toponeprofile@gmail.com"

# Commit and push
git checkout main
git add .
git commit -m "Update"
git push --set-upstream origin main
