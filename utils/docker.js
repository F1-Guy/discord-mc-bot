const { exec } = require("child_process");

const Result = {
    Success: "success",
    Failure: "failure",
    Error: "error",
}

class DockerManager {
    constructor(containerName) {
        this.containerName = containerName;
    }

    async check() {
        exec(`docker container inspect -f '{{.State.Running}}' ${this.containerName}`, (stdin, stdout, stderr) => {
            stdout = stdout.trim("\n");
            if (stdout === "true") return Result.Success;
            if (stdout === "false") return Result.Failure;
            return Result.Error;
        });
    }
    async start() {
        const res = await this.check();
        if (res == undefined) return Result.Error;
        if (res == true) return Result.Failure;
        exec(`docker start ${this.containerName}`, (stdin, stdout, stderr) => {
            if (stdout == this.containerName) return Result.Success;
            return Result.Failure;
        });

    }

    async stop() {
        const res = await this.check();
        if (res == undefined) return Result.Error;
        if (res == false) return Result.Failure;
        exec(`docker stop ${this.containerName}`, (stdin, stdout, stderr) => {
            if (stdout == this.containerName) return Result.Success;
            return Result.Failure;
        });
    }

}

module.exports = { DockerManager, Result };
