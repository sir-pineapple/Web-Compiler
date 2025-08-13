const fs = require('fs');
const path = require('path');
const { Writable } = require('stream');
const Docker = require('dockerode');

async function runCode(lang, file) {
    if (!file) {
        return { statusCode: 403, message: "no file received" };
    }
    const filePath = path.resolve(file.path);
    const fileName = file.originalname;
    const outputName = path.parse(fileName).name;

    let packageName;
    let shellcommand;
    switch (lang) {
        case "C":
            packageName = "gcc";
            shellcommand = `gcc -o /app/${outputName} /app/${fileName} && /app/${outputName} || (echo 'Compilation failed' && exit 1)`;
            break;
        case "C++":
            packageName = "gcc";
            shellcommand = `g++ -o /app/${outputName} /app/${fileName} && /app/${outputName} || (echo 'Compilation failed' && exit 1)`;
            break;
        case "Java":
            packageName = "openjdk";
            shellcommand = `javac /app/${fileName} && java -cp /app ${outputName} || (echo 'Compilation or execution failed' && exit 1)`;
            break;
        case "Python":
            packageName = "python";
            shellcommand = `python3 /app/${fileName} || (echo 'Execution failed' && exit 1)`;
            break;
        default:
            return { statusCode: 403, message: "invalid language" };
    }

    let output = "";
    const outputStream = new Writable({
        write(chunk, encoding, callback) {
            output += chunk.toString();
            callback();
        }
    });

    const docker = new Docker();

    try {
        await docker.run(
            `${packageName}:latest`,
            ["sh", "-c", shellcommand],
            outputStream,
            {
                HostConfig: {
                    Binds: [`${filePath}:/app/${fileName}`]
                }
            }
        );

        return { statusCode: 200, message: output };
    } catch (err) {
        console.error(err);
        return { statusCode: 503, message: "error during execution" };
    } finally {
        fs.unlinkSync(filePath);
    }
}

module.exports = {
    runCode
};
