import { startGame, resetGame } from './game.js';
import { initializeMIDI } from './midi.js';

document.getElementById('startButton').addEventListener('click', startGame);
document.getElementById('resetButton').addEventListener('click', resetGame);

initializeMIDI();
