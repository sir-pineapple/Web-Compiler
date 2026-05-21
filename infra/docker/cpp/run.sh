#!/bin/bash

g++ main.cpp -o app

if [ $? -ne 0 ]; then
    exit 1
fi

timeout 5s ./app < stdin.txt