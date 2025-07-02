FROM gcc:latest

WORKDIR /app

COPY code.cpp /app/code.cpp

ENTRYPOINT ["sh", "-c", "g++ -o /app/code /app/code.c && /app/code || (echo 'Compilation failed' && exit 1)"]
