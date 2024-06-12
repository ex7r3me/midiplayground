import { handlePadPress, startGame, resetGame } from './game.js';

export let midiAccess = null;
export let launchpadOutput = null;
export let launchpadInput = null;

export function initializeMIDI() {
    navigator.requestMIDIAccess().then(onMIDISuccess, onMIDIFailure);
}

function onMIDISuccess(midi) {
    midiAccess = midi;
    for (let output of midiAccess.outputs.values()) {
        if (output.name.includes('Launchpad')) {
            launchpadOutput = output;
            break;
        }
    }
    for (let input of midiAccess.inputs.values()) {
        if (input.name.includes('Launchpad')) {
            launchpadInput = input;
            launchpadInput.onmidimessage = onMIDIMessage;
            break;
        }
    }

    if (launchpadOutput && launchpadInput) {
        document.getElementById('status').innerText = 'Launchpad connected. Press pad "Capture MIDI" to start the game.';
    } else {
        document.getElementById('status').innerText = 'Launchpad not found. Please connect a Launchpad and reload the page.';
    }
}

function onMIDIFailure() {
    document.getElementById('status').innerText = 'Failed to access MIDI devices.';
}

function onMIDIMessage(event) {
    const [status, pad, velocity] = event.data;
    if (pad === 98) {
        startGame();
    } 

    if (status === 144 && velocity > 0) {
        handlePadPress(pad);
    }
}

export function sendMIDIMessage([status, pad, velocity]) {
    if (launchpadOutput) {
        launchpadOutput.send([status, pad, velocity]);
    }
}
