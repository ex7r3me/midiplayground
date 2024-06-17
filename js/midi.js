import { handlePadPress, startGame } from './game.js';

export let midiAccess = null;
export let launchpadOutput = null;
export let launchpadInput = null;

export function initializeMIDI() {
    navigator.requestMIDIAccess({ sysex: true }).then(onMIDISuccess, onMIDIFailure);
}

function onMIDISuccess(midi) {
    midiAccess = midi;
    const deviceSelector = document.getElementById('midiDeviceSelector');

    // Setup for outputs
    midiAccess.outputs.forEach(output => {
        const option = document.createElement('option');
        option.value = output.id;
        option.text = output.name;
        deviceSelector.appendChild(option);
    });

    // Setup for inputs
    const inputs = midiAccess.inputs.values();
    for (let input = inputs.next(); input && !input.done; input = inputs.next()) {
        input.value.onmidimessage = onMIDIMessage;
    }

    deviceSelector.onchange = () => {
        const selectedId = deviceSelector.value;
        launchpadOutput = midiAccess.outputs.get(selectedId);
    };
}

function onMIDIFailure(error) {
    document.getElementById('status').innerText = 'Failed to access MIDI devices.';
    console.error("Failed to get MIDI access:", error);
}

function setLaunchpadMode(mode) {
    if (!launchpadOutput) return;

    // SysEx message to switch Launchpad X mode
    let sysexMessage;
    if (mode === 'user') {
        sysexMessage = [
            0xF0, // SysEx start
            0x00, 0x20, 0x29, // Novation Manufacturer ID
            0x02, 0x13, // Device ID and family code for Launchpad X
            0x0E, // Command for mode change
            0x01, // Mode: 1 = standalone, 2 = DAW, 3 = Programmer
            0xF7  // SysEx end
        ];
    }

    if (sysexMessage) {
        launchpadOutput.send(sysexMessage);
    }
}

function onMIDIMessage(event) {
    const [status, pad, velocity] = event.data;
    if ((status === 144 || status === 176) && velocity > 0) { // Note on message
        if (pad === 98) {
            startGame();
        } else {
            handlePadPress(pad);
        }
    }
}

export function sendMIDIMessage([status, pad, velocity]) {
    if (launchpadOutput) {
        launchpadOutput.send([status, pad, velocity]);
    } else {
    }
}

function clearAllLights() {
    for (let i = 11; i <= 88; i++) {
        if (i % 10 !== 9 && i % 10 !== 0) { // Exclude 9, 19, 29, 39, ..., 89 and 0, 10, 20, ...
            sendMIDIMessage([144, i, 0]);
        }
    }
}
