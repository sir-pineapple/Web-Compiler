#!/bin/bash

cd /workspace

timeout 5s python3 main.py < stdin.txt

RUN_EXIT=$?

if [ $RUN_EXIT -eq 124 ]; then
    exit 102
fi

exit $RUN_EXIT