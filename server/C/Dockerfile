FROM ubuntu:latest

ENV DEBIAN_FRONTEND=noninteractive

WORKDIR /app

COPY code.c /app/code.c

RUN gcc code.c -o code

ENTRYPOINT ["/app/a.out"]