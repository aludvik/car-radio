import assert from 'assert';
import express from 'express';
import fs, { appendFile } from 'fs';
import os from 'node:os';
import { spawn } from 'child_process';

const public_port = 8080;
// const state_path = "./state.json";

// function loadStateFromDisk() {
//     return JSON.parse(fs.readFileSync(state_path));
// }

// let STATE = loadStateFromDisk();
let POWER = false;
let STREAM_PROCESS = null;
let STATION = null;

class Station {
    name = "";
    freq = "";
    url = "";
    constructor(name, freq, url) {
        this.name = name;
        this.freq = freq;
        this.url = url;
    }
    static fromObj(obj) {
        // TODO: Add additional validation
        return new Station(obj['name'], obj['freq'], obj['url']);
    }
    toObj() {
        return {'name': this.name, 'freq': this.freq, 'url': this.url};
    }
};

class Radio {
    constructor() {
        this.stream_process = null;
        this.station = null;
        this.power = false;
    }

    togglePower() {
        if (this.power) {
            this.power = false;
            if (this.stream_process !== null) {
                this.stream_process.kill();        
            }
        } else {
            this.power = true;
            if (this.station !== null) {
                this.stream_process = playStream(this.station);
            }
        }
    }

    tune(station) {
        this.station = station;
        if (this.power) {
            if (this.stream_process !== null) {
                this.stream_process.kill();
            }
            this.stream_process = playStream(this.station);
        }
    }
}

const radio = new Radio();
const app = express();
app.use(express.json());

// POST /power
// Change power state
// {}
app.post('/power', (req, res) => {
    radio.togglePower();
    res.json(radio.power);
});

// POST /tune
// Tune radio to station or preset
// {"preset": number} or {"name": string, "freq": string, "url": string}
app.post('/tune', (req, res) => {
    let station = Station.fromObj(req.body);
    radio.tune(station);
    res.json(true);
});

// GET /preset/:id
// Get playing station info
// {"name": string, "freq": string, "url": string}
app.get('/preset/:id', (req, res) => {

});

// PUT /preset/:id
// Save playing station to preset
// {}

// Spawn stream process and return PID
const BINARY_PATHS = {
    'darwin': '/Applications/VLC.app/Contents/MacOS/VLC',
    'linux': '',
};
const BINARY_PATH = BINARY_PATHS[os.platform()];
function playStream(station) {
    const command = BINARY_PATH;
    const flags = [station.url];
    console.log(`${command} ${flags}`);
    return spawn(command, flags, {stdio: 'ignore'});
}

app.listen(public_port, () => console.log(`listening at http://localhost:${public_port}`));