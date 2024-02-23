import { API_PORT, PROCESS_NAME, PROCESS_PATH } from '../config';
import express from 'express'
import { lookup } from 'ps-node'
import { exec, execSync } from 'child_process'
import { existsSync, lstatSync, readFileSync, readdirSync } from 'fs';
import type { apiCalls } from '@/dev/types';

const app = express();
let currentPid: number = -1;
let currentId: number = -1;
let isTrainingVar: boolean = false;

function checkQuerys(reqQuerys: { [key: string]: any }, querys: string[]): boolean {
  const keys = Object.keys(reqQuerys);
  return querys.every(k => keys.includes(k))
}

function isTraining(): Promise<boolean> {
  return new Promise((resolve, _) => {
    lookup({
      pid: currentPid
    }, (_, process) => {
      if (process.length > 0) {
        resolve(true)
      } else {
        resolve(false)
      }
    })
  })
}

app.get("/training/list", async (_, res) => {
  res.header("Access-Control-Allow-Origin", "*");
  console.log("GET [/training/list]");
  const path = PROCESS_PATH + "/trainings"
  const apiRes: apiCalls["/training/list"]["data"] = readdirSync(path)
    .filter(x => lstatSync(path + "/" + x).isDirectory())
    .filter(x => existsSync(path + "/" + x + "/data.bin"))
    .filter(x => lstatSync(path + "/" + x + "/data.bin").isFile())
    .map(x => {
      const p = path + "/" + x;
      if (existsSync(p + "/metrics.csv")) {
        const file = readFileSync(p + "/metrics.csv", { encoding: "utf8" }).split("\n").slice(0, -1);
        const n = file.length;
        const m = file[n - 1].split(";").length;
        const fS = file[n - 1].split(";");
        return {
          id: parseInt(x),
          metrics: file.map(x => x.split(";").map(x => parseFloat(x))),
          groupSize: parseFloat(fS[m - 1]),
          nbNetwork: parseFloat(fS[m - 2]),
          average: parseFloat(fS[2]),
          best: parseFloat(fS[1]),
          nbGen: parseFloat(fS[0]),
        }
      }
      return {
        id: parseInt(x),
        metrics: [],
        groupSize: -1,
        nbNetwork: -1,
        average: -1,
        best: -1,
        nbGen: -1,
      }
    })

  res.send(apiRes)
})

app.get("/training", async (_, res) => {
  res.header("Access-Control-Allow-Origin", "*");
  console.log("GET [/training]");
  let apiRes: apiCalls["/training"]["data"];
  const r = await isTraining();

  // Get trainings
  const path = PROCESS_PATH + "/trainings"
  const files: number[] = readdirSync(path)
    .filter(x => lstatSync(path + "/" + x).isDirectory())
    .filter(x => existsSync(path + "/" + x + "/data.bin"))
    .filter(x => lstatSync(path + "/" + x + "/data.bin").isFile())
    .map(x => parseInt(x) || -1)
    .filter(x => x !== -1)

  apiRes = {
    id: r ? currentId : -1,
    isTraining: r,
    trainings: files,
  }
  res.send(apiRes)
})

app.post("/training/create", async (req, res) => {
  res.header("Access-Control-Allow-Origin", "*");
  console.log("GET [/training/create]");
  const querys: string[] = ["nbNetwork", "groupSize", "id"]
  if (!checkQuerys(req.query, querys)) {
    res.sendStatus(422);
    return;
  }

  const command: string = `./${PROCESS_NAME} ${req.query["id"]} 1 ${req.query["nbNetwork"]} ${req.query["groupSize"]}`
  exec(command, {
    cwd: PROCESS_PATH
  }, (error, _, __) => {
    if (error) {
      res.sendStatus(500)
      return;
    }
    res.sendStatus(200)
  })
})

function start(id: number) {
  const command: string = `./${PROCESS_NAME} ${id} 0`;
  const child = exec(command, {
    cwd: "/Users/albandelarochefoucauld/DevWorkspace/GitHub/FootChaos-Metal/"
  })
  currentPid = child.pid || -1;
  currentId = id
  isTrainingVar = true;
}

async function checkFailed() {
  while (isTrainingVar) {
    if (!(await isTraining())) {
      console.log(`Training ${currentId} crash! Restarting...`)
      start(currentId);
    }

    await new Promise((resolve, _) => { setTimeout(() => { resolve(true) }, 5000) })
  }
}

app.post("/training/start", async (req, res) => {
  res.header("Access-Control-Allow-Origin", "*");
  console.log("GET [/training/start]");
  const querys: string[] = ["id"]
  if (!checkQuerys(req.query, querys)) {
    res.sendStatus(422);
    return;
  }

  const r = await isTraining();
  if (r) {
    res.sendStatus(409)
    return;
  }

  const id = parseInt(req.query["id"] as string || "0")
  start(id)

  res.sendStatus(200);

  checkFailed();
})

app.post("/training/end", async (_, res) => {
  res.header("Access-Control-Allow-Origin", "*");
  console.log("GET [/training/end]");
  if (await isTraining()) {
    process.kill(currentPid);
    isTrainingVar = false;
    currentId = -1;
    currentPid = -1;
  }

  res.sendStatus(200);
})


console.log(`Launching api on port: ${API_PORT}`)
app.listen(API_PORT, () => {
  console.log(`Launch !`)
})
