FROM eclipse-temurin:21-jdk-jammy

RUN useradd -m compiler

COPY run.sh /run.sh

RUN chmod +x /run.sh

WORKDIR /workspace

CMD ["/bin/bash", "/run.sh"]