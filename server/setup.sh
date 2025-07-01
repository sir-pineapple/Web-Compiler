#!/bin/bash

LANGUAGE=$1
CODE_FILE=$2

apt-get update

if [ "$LANGUAGE" == "python" ]; then
	apt-get install -y python3
	python3 $CODE_FILE
elif [ "$LANGUAGE" == "java" ]; then
	apt-get install -y openjdk-11-jdk
	javac $CODE_FILE
	CLASS_NAME=$(basename "$CODE_FILE" .java)
	java $CLASS_NAME
elif [ "$LANGUAGE" == "c" ]; then
	gcc $CODE_FILE
	./a.out
elif [ "$LANGUAGE" == "cpp" ]; then
	g++ $CODE_FILE
	./a.out
else
	echo "Unsupported language"
	exit 1
fi
