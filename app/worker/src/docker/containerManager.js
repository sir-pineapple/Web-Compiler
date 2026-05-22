const Docker = require("dockerode");
const path = require("path");

const docker = new Docker({
    socketPath: "/var/run/docker.sock"
});

const languageImageMap = { cpp: "compiler-cpp" };

const runContainer = async (language, tempDir) => {
    const hostTempDir = path.join(process.env.HOST_WORKER_TEMP, tempDir.split("/").pop());

    const image = languageImageMap[language];

    const container = await docker.createContainer({
        Image: image,

        HostConfig: {
            NetworkMode: "none",
            Memory: 256*1024*1024,
            NanoCPUs: 500000000,
            PidsLimit: 50,

            Tmpfs: {
                "/tmp": ""
            },

            Binds: [
                `${hostTempDir}:/workspace:rw`
            ]
        }
    });

    await container.start();

    const  { PassThrough } = require("stream");

    const logStream = await container.logs({
        stdout: true,
        stderr: true,
        follow: true
    });

    let stdout = "";
    let stderr = "";

    const stdoutStream = new PassThrough();
    const stderrStream = new PassThrough();

    stdoutStream.on(
        "data",
        (chunk) => {
            stdout += chunk.toString();
        }
    );

    stderrStream.on(
        "data",
        (chunk) => {
            stderr += chunk.toString();
        }
    );

    container.modem.demuxStream(logStream, stdoutStream, stderrStream);

    const result = await container.wait();
    const exitCode = result.StatusCode;
    await container.remove();
    
    let status = "success";

    switch (exitCode) {
        case 0:
            status = "success";
            break;
        case 101:
            status = "compile_error";
            break;
        case 102:
            status = "timeout";
            stderr = "Execution exceeded time limit";
            break;
        default:
            status = "runtime_error";
    }

    return { status, stdout, stderr, exitCode };
};

module.exports = runContainer;