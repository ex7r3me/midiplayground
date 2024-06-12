const sounds = [
    new Audio('assets/sound1.mp3'),
    new Audio('assets/sound2.mp3'),
    new Audio('assets/sound3.mp3'),
    new Audio('assets/sound4.mp3')
];

export function playSound(pad) {
    const soundIndex = pad % sounds.length;
    sounds[soundIndex].currentTime = 0; // Reset sound to start
    sounds[soundIndex].play();
}
