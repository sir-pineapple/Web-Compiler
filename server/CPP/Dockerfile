FROM ubuntu:latest

ENV DEBIAN_FRONTEND=noninteractive

WORKDIR /app

COPY run_code.sh /app/run_code.sh

RUN chmod +x /app/run_code.sh

ENTRYPOINT ["/app/run_code.sh"]