FROM python:latest

WORKDIR /app

COPY code.py /app/code.py

ENTRYPOINT ["sh", "-c", "python /app/code.py || (echo 'Execution failed' && exit 1)"]
