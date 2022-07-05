import assert from 'assert';
import express, { json } from 'express';
import fs, { appendFile } from 'fs';
import os from 'node:os';
import { spawn } from 'child_process';

const public_port = 8080;

// TODO: Use non-blocking log statements
// TODO: persist presets, playing station on restarts

class Station {
    name = "";
    freq = "";
    url = "";
    constructor(name, freq, url) {
        this.name = name;
        this.freq = freq;
        this.url = url;
    }
    // Assumes obj is valid
    static fromObj(obj) {
        return new Station(obj['name'], obj['freq'], obj['url']);
    }
    toObj() {
        return { 'name': this.name, 'freq': this.freq, 'url': this.url };
    }
};

class Radio {
    constructor() {
        this.stream_process = null;
        this.station = null;
        this.power = false;
        this.presets = [null, null, null, null, null, null];
        this.error = null;
    }

    status() {
        if (!this.power) {
            return 'off';
        } else if (this.station === null) {
            return 'no station';
        } else if (this.stream_process !== null) {
            return 'playing'
        } else {
            return 'error'
        }
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
        if (idx < 1 || idx > 6) {
            console.log('tunePreset: out of range');
            return false;
        }
        let station = this.presets[idx - 1];
        if (station === null) {
            console.log('tunePreset: no station playing');
            return false;
        }
        this.tune(station);
        return true;
    }

    setPreset(idx) {
        if (idx < 1 || idx > 6) {
            console.log('tunePreset: out of range');
            return false;
        }
        this.presets[idx - 1] = this.station;
    }
}

const state_path = "./state";

function initRadio() {
    const new_radio = new Radio();
    if (fs.existsSync(state_path)) {
        let state = JSON.parse(fs.readFileSync(state_path));
        new_radio.station = Station.fromObj(state.station);
        new_radio.presets = state.presets.map(station => {
            if (station === null) {
                return null;
            }
            return Station.fromObj(station);
        });
        if (state.power) {
            new_radio.togglePower();
        }
    }
    return new_radio; 
}

function persistRadio() {
    const state = {
        station: radio.station.toObj(),
        power: radio.power,
        presets: radio.presets.map(station => {
            if (station === null) {
                return null;
            }
            return station.toObj();
        }),
    };
    fs.writeFileSync(state_path, JSON.stringify(state));
}

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
    return spawn(command, flags, { stdio: 'ignore' });
}

const radio = initRadio();
const app = express();
app.use(express.json());

function logRequest(path, req) {
    console.log(`${path} ${Object.keys(req.body).map(key => `${key}=${req.body[key]}`)}`);
}

// POST /power
// Change power state
// Request: {}
// Response: {"power": bool} # current power state
app.post('/power', (req, res) => {
    logRequest('POST /power', req);
    radio.togglePower();
    persistRadio();
    res.json(radio.power);
});

// POST /tune
// Tune radio to station or preset
// Request: {"preset": number} or {"name": string, "freq": string, "url": string}
// Response: {"valid": bool, "msg": string} # if invalid station or preset, return valid=false and reason in msg
// Note: Does not guarantee radio is actually playing the station,
// if the URL is invalid or there is an issue with VLC, this will still return success.
app.post('/tune', (req, res) => {
    logRequest('POST /tune', req);
    if ('preset' in req.body) {
        let preset = req.body['preset'];
        if (typeof preset !== 'number') {
            return res.json({'valid': false, 'msg': 'Preset not a number'});
        }
        if (preset < 1 || preset > 6) {
            return res.json({'valid': false, 'msg': 'Preset not between 1 and 6'});
        }
        let result = radio.tunePreset(preset);
        persistRadio();
        return res.json({'valid': result});
    } else {
        if (!('name' in req.body)) {
            return res.json({'valid': false, 'msg': 'Station missing name'});
        }
        if (!('freq' in req.body)) {
            return res.json({'valid': false, 'msg': 'Station missing frequency'});
        }
        if (!('url' in req.body)) {
            return res.json({'valid': false, 'msg': 'Station missing url'});
        }
        let station = Station.fromObj(req.body);
        let result = radio.tune(station);
        persistRadio();
        res.json({'valid': result});
    }
});

// GET /status
// Get status of radio
// Response: {
//    "status": "off" | "playing" | "no station" | "error",
//    "station": null | {"name": string, "freq": string, "url": string}, # if status=playing, station info
//    "msg": null | string, # if status=error, set to the error message
// }
app.get('/status', (req, res) => {
    logRequest('GET /status', req);
    let status = radio.status();
    let response = {'status': status};
    if (status === 'playing') {
        response['station'] = radio.station.toObj();
    } else if (status === 'error') {
        response['msg'] = radio.error;
    }
    return res.json(response);
});

// GET /preset/:id
// Get station info for preset
// Response: null if no preset or {"name": string, "freq": string, "url": string}
app.get('/preset/:id', (req, res) => {
    let id = req.params['id'];
    logRequest(`GET /preset/${id}`);
    if (!(typeof id === 'number') || id < 1 || id > 6) {
        return res.json(null);
    }
    return res.json(radio.presets[id]);
});

// PUT /preset/:id
// Save playing station to preset
// Request: {} # uses currently playing station
// Response: {'success': bool, 'msg': string} # success=false if preset invalid or no station playing, msg to explain
app.put('/preset/:id', (req, res) => {
    let id = Number(req.params['id']);
    logRequest(`PUT /preset/${id}`, req);
    if (!(typeof id === 'number') || id < 1 || id > 6) {
        return res.json({'success': false, 'msg': 'Invalid prefix'});
    }
    if (radio.station === null) {
        return res.json({'success': false, 'msg': 'No station playing'});
    }
    radio.setPreset(id);
    persistRadio();
    return res.json({'success': true});
});

app.listen(public_port, () => console.log(`listening at http://localhost:${public_port}`));