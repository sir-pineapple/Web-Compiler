const Docker = require("dockerode");
const path = require("path");

const docker = new Docker({
    sockerPath: "/var/run/docker.sock"
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

    const stream = await container.logs({
        stdout: true,
        stderr: true,
        follow: true
    });

    let output = "";

    stream.on("data", (chunk) => {
        output += chunk.toString();
    });

    await container.wait();
    await container.remove();
    return output;
};

module.exports = runContainer;