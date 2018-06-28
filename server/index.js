require('dotenv').config();
import fs from 'fs';
import express from 'express';
import http from 'http';
import socket from 'socket.io';
import history from 'connect-history-api-fallback';
import Game from './Game';

const app = express();
const server = http.createServer(app);
const io = socket(server);
const port = process.env.VUE_APP_SOCKET_PORT || 3000;

app.use(history());

app.use(express.static(__dirname + '/dist'));

server.listen(port, function() {
    console.log(`Server is listening on: ${port}`);
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

        broadcast(socket, currentGame.publicData);
    });

    const logOutClient = logOut(socket, currentClient);

    socket.on('log_out', logOutClient);
    socket.on('disconnect', logOutClient);

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
    });

    socket.on('score', (participant) => {
        currentGame.score(participant);
        broadcast(socket, currentGame.publicData);
    });
});

function logOut(socket, currentClient) {
    return function() {
        if (!currentClient) return;

        clients.delete(currentClient);
        socket.emit('log_out_success', currentClient);
        console.log(`Client ${currentClient} disconnected`);
    }
}

function broadcast(socket, data) {
    socket.emit('sync', data);
    socket.broadcast.emit('sync', data);
}