FROM ubuntu:latest

ENV DEBIAN_FRONTEND:noninteractive

RUN apt-get update && apt-get install default-jre

WORKDIR /app

COPY run_code.sh /app/run_code.sh

RUN chmod +x /app/run_code.sh

ENTRYPOINT ["/app/run_code.sh"]