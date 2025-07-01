FROM ubuntu:latest

ENV DEBIAN_FRONTEND=noninteractive

WORKDIR /app

COPY setup.sh /app/setup.sh

RUN chmod +x /app/setup.sh

ENTRYPOINT ["/app/setup.sh"]
