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
        this.presets = [null, null, null, null, null, null];
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
            } else if (this.presets[0] !== null) {
                this.stream_process = playStream(this.presets[0]);
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

    tunePreset(idx) {
        this.tune(this.presets[idx]);
    }

    setPreset(idx) {
        if (this.station !== null) {
            this.presets[idx] = this.station;
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
    if ('preset' in req.body) {
        radio.tunePreset(req.body['preset']);
    } else {
        let station = Station.fromObj(req.body);
        radio.tune(station);
    }
    // TODO: return whether spawning the stream succeeded
    res.json(true);
});

// GET /playing
// Get playing station info
// {"name": string, "freq": string, "url": string}
app.get('/playing', (req, res) => {
    return res.json(radio.station.toObj());
});

// GET /preset/:id
// Get station info for preset
// {"name": string, "freq": string, "url": string}
app.get('/preset/:id', (req, res) => {
    // TODO: valid preset is 1-6
    return res.json(radio.presets[req.params['id']])
});

// PUT /preset/:id
// Save playing station to preset
// {}
app.put('/preset/:id', (req, res) => {
    radio.setPreset(req.params['id']);
    return res.json({});
});

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