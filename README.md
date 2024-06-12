
# Mini MIDI Game

This is a mini MIDI game designed to work with the Novation Launchpad X. The game lights up a pad on the Launchpad, and the user must press the correct pad within a certain time limit. The game continues for a set number of steps and calculates the total time taken by the user.

## Project Structure

```
mini-midi-game/
│
├── index.html
├── css/
│   └── styles.css
├── js/
│   ├── app.js
│   ├── midi.js
│   ├── game.js
│   └── sounds.js
└── assets/
    ├── sound1.mp3
    ├── sound2.mp3
    ├── sound3.mp3
    └── sound4.mp3
```

## Features

- Lights up pads on the Launchpad X.
- User must press the correct pad within a certain time limit.
- Plays a sound when a pad is pressed.
- Tracks the user's score and total time taken.
- Includes a reset button to clear the lights and reset the game.
- Can start the game by pressing pad 99 on the Launchpad X or using the start button.

## How to Run

1. **Install `http-server`** (if not already installed):

    ```bash
    npm install -g http-server
    ```

2. **Navigate to your project directory**:

    ```bash
    cd path/to/your/mini-midi-game
    ```

3. **Start the HTTP server**:

    ```bash
    http-server
    ```

4. **Open the game in your browser**:

    Open your browser and go to the address `http://localhost:8080` (or another port if specified).

## Files Description

- **index.html**: The main HTML file that sets up the structure of the game.
- **css/styles.css**: Contains the styling for the game.
- **js/app.js**: Initializes the MIDI connection and sets up event listeners for the buttons.
- **js/midi.js**: Handles the MIDI connection and messages.
- **js/game.js**: Contains the game logic, including sequence generation, pad lighting, and scoring.
- **js/sounds.js**: Plays sounds when pads are pressed.
- **assets/**: Contains the sound files used in the game.

## Customization

- **Colors**: You can change the colors of the pads by modifying the `getRandomColor` function in `game.js`.
- **Sounds**: You can add or replace sound files in the `assets` directory and update the `sounds.js` file accordingly.

## License

This project is licensed under the MIT License.
