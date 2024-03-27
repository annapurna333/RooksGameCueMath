const express = require('express');
const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server);

const PORT = process.env.PORT || 3000;

app.use(express.static('public')); // Serve static files from 'public' directory

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/public/index.html');
});

let players = [];
let currentPlayer = 1; // Player 1 starts first
let rookPosition = { x: 7, y: 0 }; // Initial position at top-right corner

io.on('connection', (socket) => {
    console.log('New player connected:', socket.id);

    // Assign player number to the connected client
    const playerNumber = players.length + 1;
    players.push({ id: socket.id, number: playerNumber });

    // Emit player number to the connected client
    socket.emit('playerNumber', playerNumber);

    // Handle player disconnect
    socket.on('disconnect', () => {
        console.log('Player disconnected:', socket.id);
        // Remove disconnected player from the players array
        players = players.filter(player => player.id !== socket.id);
    });

    // Handle player moves
    socket.on('moveRook', (direction) => {
        if (currentPlayer === playerNumber) {
            // Update rook position based on the direction
            if (direction === 'left' && rookPosition.x > 0) {
                rookPosition.x--;
            } else if (direction === 'down' && rookPosition.y < 7) {
                rookPosition.y++;
            }

            // Broadcast the new rook position to all clients
            io.emit('rookMoved', rookPosition);

            // Check win condition
            if (rookPosition.x === 0 && rookPosition.y === 7) {
                // Declare the current player as the winner
                io.emit('gameOver', currentPlayer);
            } else {
                // Switch to the next player's turn
                currentPlayer = currentPlayer === 1 ? 2 : 1;
                io.emit('nextTurn', currentPlayer);
            }
        }
    });
});

server.listen(3000, () => {
    console.log('Server started on port 3000');
});