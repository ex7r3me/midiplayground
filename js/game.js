import { sendMIDIMessage } from './midi.js';
import { playSound } from './sounds.js';

let gameSequence = [];
let currentStep = 0;
let startTime = null;
let endTime = null;
let stepTimeout = null;
let score = 0;
const totalSteps = 10;
const stepDuration = 3000; // 3 seconds per step

export function startGame() {
    gameSequence = [];
    currentStep = 0;
    startTime = null;
    endTime = null;
    score = 0;
    clearTimeout(stepTimeout);
    document.getElementById('status').innerText = 'Get ready...';
    countdown(3); // Start 3-second countdown
}

function countdown(seconds) {
    if (seconds > 0) {
        document.getElementById('status').innerText = `Starting in ${seconds}...`;
        displayNumberOnLaunchpad(seconds);
        setTimeout(() => {
            clearLaunchpad();
            countdown(seconds - 1);
        }, 1000);
    } else {
        document.getElementById('status').innerText = 'Game started! Follow the lights.';
        generateSequence();
        lightNextPad();
    }
}

function displayNumberOnLaunchpad(number) {
    const numberPatterns = {
        3: [12, 13, 14, 15, 16, 22, 26, 32, 33, 34, 35, 36, 42, 46, 52, 53, 54, 55, 56, 62, 66, 72, 73, 74, 75, 76],
        2: [12, 13, 14, 15, 16, 22, 26, 32, 36, 42, 46, 52, 56, 62, 66, 72, 73, 74, 75, 76],
        1: [14, 24, 34, 44, 54, 64, 74, 84]
    };

    const pads = numberPatterns[number];
    pads.forEach(pad => sendMIDIMessage([144, pad, getRandomColor()]));
}

function clearLaunchpad() {
    for (let i = 11; i <= 88; i++) {
        if (i % 10 !== 9 && i % 10 !== 0) { // Exclude 19, 29, 39, ..., 89 and 10, 20, 30, ...
            sendMIDIMessage([144, i, 0]);
        }
    }
}

function generateSequence() {
    const validPads = [];
    for (let i = 11; i <= 88; i++) {
        if (i % 10 !== 9 && i % 10 !== 0) { // Exclude 19, 29, 39, ..., 89 and 10, 20, 30, ...
            validPads.push(i);
        }
    }

    for (let i = 0; i < totalSteps; i++) {
        const pad = validPads[Math.floor(Math.random() * validPads.length)];
        gameSequence.push(pad);
    }
}

function lightNextPad() {
    if (currentStep < totalSteps) {
        const pad = gameSequence[currentStep];
        lightPad(pad, true);
        if (currentStep > 0) {
            lightPad(gameSequence[currentStep - 1], false);
        }
        if (currentStep === 0) {
            startTime = performance.now();
        }

        stepTimeout = setTimeout(() => {
            // Move to the next step if the user fails to press the correct pad in time
            lightPad(pad, false);
            currentStep++;
            document.getElementById('status').innerText = `Missed! Score: ${score}`;
            lightNextPad();
        }, stepDuration);

    } else {
        endTime = performance.now();
        calculateTime();
    }
}

export function handlePadPress(pad) {
    if (pad === gameSequence[currentStep]) {
        clearTimeout(stepTimeout);
        score++;
        playSound(pad);
        currentStep++;
        document.getElementById('status').innerText = `Good job! Score: ${score}`;
        lightNextPad();
    }
}

function lightPad(pad, on) {
    const color = on ? getRandomColor() : 0; // Get a random color for on, 0 for off
    sendMIDIMessage([144, pad, color]);
}

function getRandomColor() {
    const colors = [5, 21, 37, 53, 89, 105, 121]; // Different color values
    return colors[Math.floor(Math.random() * colors.length)];
}

function calculateTime() {
    const timeTaken = (endTime - startTime) / 1000;
    document.getElementById('status').innerText = `Game over! Time taken: ${timeTaken.toFixed(2)} seconds. Final score: ${score}. Press Start to play again.`;
}

export function resetGame() {
    clearTimeout(stepTimeout);
    turnOffAllPads();
    gameSequence = [];
    currentStep = 0;
    startTime = null;
    endTime = null;
    document.getElementById('status').innerText = 'Game reset. Press pad 99 or Start button to begin again.';
}

function turnOffAllPads() {
    for (let i = 11; i <= 88; i++) {
        if (i % 10 !== 9 && i % 10 !== 0) { // Exclude 19, 29, 39, ..., 89 and 10, 20, 30, ...
            lightPad(i, false);
        }
    }
}
