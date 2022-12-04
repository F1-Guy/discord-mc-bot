const { exec } = require("child_process");
const util = require("util");

const Result = {
    Success: "success",
    Failure: "failure",
    Error: "error",
}

function run(cmd) {
  return new Promise((resolve, reject) => {
    exec(cmd, (error, stdout, stderr) => {
      if (error) return reject(error)
      if (stderr) return reject(stderr)
      resolve(stdout)
    })
  })
}


class DockerManager {
    constructor(containerName) {
        this.containerName = containerName;
    }

    async check() {
        let res = await run(`docker container inspect -f '{{.State.Running}}' ${this.containerName}`);
        res = res.trim("\n");
        if (res === "true") return Result.Success;
        if (res === "false") return Result.Failure;
        return Result.Error;
    }
    async start() {
        const check = await this.check();
        if (check == Result.Error) return Result.Error;
        if (check == Result.Success) return Result.Failure;
        let rez = await run(`docker start ${this.containerName}`);
        rez = rez.trim("\n");
        if (rez == this.containerName) return Result.Success;
        return Result.Failure;
    }

    async stop() {
        const check = await this.check();
        if (check == undefined) return Result.Error;
        if (check == Result.Failure) return Result.Failure;
        let rez = await run(`docker stop ${this.containerName}`);
        rez = rez.trim("\n");
        if (rez == this.containerName) return Result.Success;
        return Result.Failure;
    }

}

module.exports = { DockerManager, Result };
