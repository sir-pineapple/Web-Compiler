#!/bin/bash

cd /workspace

javac Main.java

COMPILE_EXIT=$?

if [ $COMPILE_EXIT -ne 0 ]; then
    exit 101
fi

timeout 5s java Main < stdin.txt

RUN_EXIT=$?

if [ $RUN_EXIT -eq 124 ]; then
    exit 102
fi

exit $RUN_EXIT