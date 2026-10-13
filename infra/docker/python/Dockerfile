FROM python:3.13-slim

RUN useradd -m compiler

COPY run.sh /run.sh

RUN chmod +x /run.sh

WORKDIR /workspace

CMD ["/bin/bash", "/run.sh"]