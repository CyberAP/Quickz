require('dotenv').config();
import fs from 'fs';
import express from 'express';
import http from 'http';
import socket from 'socket.io';
import history from 'connect-history-api-fallback';
import Game from './Game';
import EventEmitter from 'events';

const app = express();
const server = http.createServer(app);
const io = socket(server);
const port = process.env.VUE_APP_SOCKET_PORT || 3000;

app.use(history());

app.use(express.static(__dirname + '/dist'));

server.listen(port, function() {
    console.log(`Server is listening on: ${port}`);
});

class busEmitter extends EventEmitter {}
const eventBus = new busEmitter;

const savedGames = [];
const gamesPath  = 'games';

fs.readdir(gamesPath, (err, files) => {
    files.forEach((file, key, arr) => {
        fs.stat(`${gamesPath}/${file}`, (err, stats) => {
            if (err || stats.isDirectory()) return;

            fs.readFile(`${gamesPath}/${file}`, async (err, data) => {
                if (err) return;
                const savedGame = await JSON.parse(data);
                const fileName = file.replace(/\.[^/.]+$/, '');
                savedGames.push(Object.assign({ name: fileName }, savedGame));

                if (key === arr.length -1) eventBus.emit('games_loaded');
            });
        });
    });
});

let currentGame = new Game({
    rounds: [
        {
            question: 'My question',
            answer: 'Answer'
        },
        {
            question: 'My question 2',
            answer: 'Answer 2'
        },
    ]
});

const password = process.env.password || '123';

const clients = new Set;

io.on('connection', socket => {

    let currentClient = '';
    let isAdmin = false;

    console.log('Client connected');

    socket.on('authorize', auth => {
        if (!auth || typeof auth !== 'string' || clients.has(auth)) return socket.emit('auth_fail');

        currentClient = auth;
        clients.add(currentClient);
        socket.emit('auth_success', currentClient);

        console.log(`Client ${currentClient} authorized`);

        broadcast(socket, currentGame.publicData);
    });

    socket.on('log_out', logOut);
    socket.on('disconnect', logOut);

    function logOut() {
        if (!currentClient) return;

        clients.delete(currentClient);
        socket.emit('log_out_success', currentClient);
        console.log(`Client ${currentClient} disconnected`);
    }

    const commonActions = [
        'start_game',
        'prev_round',
        'next_round',
        'start_round',
        'toggle_answer',
    ];

    commonActions.forEach(action => {
        const actionCamelCase = action.replace(/_([a-z])/g, function (g) { return g[1].toUpperCase(); });
        socket.on(action, () => {
            currentGame[actionCamelCase]();
            broadcast(socket, currentGame.publicData);
        });
    });

    socket.on('attempt', () => {
        currentGame.registerAttempt(currentClient);
        broadcast(socket, currentGame.publicData);
    });


    socket.on('admin', function (adminPassword) {
        if (adminPassword !== password) return socket.emit('admin_fail');
        isAdmin = true;
        socket.emit('admin_success', adminPassword);
        console.log('Admin connected');
        adminSync();
    });

    socket.on('score', (participant) => {
        currentGame.score(participant);
        broadcast(socket, currentGame.publicData);
    });

    eventBus.on('games_loaded', adminSync);

    function adminSync() {
        if (!isAdmin) return;
        socket.emit('admin_sync', {games: savedGames});
    }
});

function broadcast(socket, data) {
    socket.emit('sync', data);
    socket.broadcast.emit('sync', data);
}