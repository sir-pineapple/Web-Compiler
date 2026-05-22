#!/bin/bash

cd /workspace

g++ main.cpp -o app

COMPILE_EXIT=$?

if [ $COMPILE_EXIT -ne 0 ]; then
    exit 101
fi

timeout 5s ./app < stdin.txt

RUN_EXIT=$?

if [ $RUN_EXIT -eq 124 ]; then
    exit 102
fi

exit $RUN_EXIT