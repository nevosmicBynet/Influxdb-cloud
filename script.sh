#!/bin/bash

# Get the current Git branch name
branch_name=$(git symbolic-ref --short HEAD)

echo "Hello, current branch is $branch_name"