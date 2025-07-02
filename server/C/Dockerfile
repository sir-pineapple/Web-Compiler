FROM gcc:latest

WORKDIR /app

COPY code.c /app/code.c

ENTRYPOINT ["sh", "-c", "gcc -o /app/code /app/code.c && /app/code || (echo 'Compilation failed' && exit 1)"]
