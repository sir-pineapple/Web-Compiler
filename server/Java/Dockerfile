FROM openjdk:latest

WORKDIR /app

COPY HelloWorld.java /app/HelloWorld.java

ENTRYPOINT ["sh", "-c", "javac /app/HelloWorld.java && java -cp /app HelloWorld || (echo 'Compilation or execution failed' && exit 1)"]
