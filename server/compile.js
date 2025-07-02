const fs = require('fs');
const path = require('path');

const Docker = require('dockerode');

async function runCode(lang, file) {
    if (!file) {
        return {statusCode: 403, message: "no file received"};
    }
    const filePath = path.resolve(file.path);
    const fileName = file.originalname;
    const outputName = path.parse(fileName).name;
    var package;
    var shellcommand;
    switch(lang) {
        case "C":
            package = "gcc";
            shellcommand = `gcc -o /app/${outputName} /app/${fileName} && /app/${outputName} || (echo 'Compilation failed' && exit 1)`;
            break;
        case "C++":
            package = "gcc";
            shellcommand = `g++ -o /app/${outputName} /app/${fileName} && /app/${outputName} || (echo 'Compilation failed' && exit 1)`;
            break;
        case "Java":
            package = "openjdk";
            shellcommand = `javac /app/${fileName} && java -cp /app ${outputName} || (echo 'Compilation or execution failed' && exit 1)`;
            break;
        case "Python":
            package = "python";
            shellcommand = `python3 /app/${fileName} || (echo 'Execution failed' && exit 1)`;
            break;
        default:
            return {status: 403, message: "invalid language"};
    }
    const docker = new Docker();
    docker
    .run(`${package}:latest`, [
        "sh",
        "-c",
        `${shellcommand}`
    ], process.stdout, {
        Binds: [
            `${filePath}:/app/${fileName}`
        ]
    })
    .then(() => {
        return;
    })
    .catch((err) => {
        console.error(err);
        return {statusCode: 503, message: "error during execution"};
    })
    .finally(() => {
        fs.unlinkSync(filePath);
    })
    return {statusCode: 200, message: "code executed successfully"};
}

module.exports = {
    runCode: runCode
}