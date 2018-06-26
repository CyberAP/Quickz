require('dotenv').config();
const fs = require('fs');
const express = require('express');
const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server);
const history = require('connect-history-api-fallback');
const port = process.env.VUE_APP_SOCKET_PORT || 3000;

app.use(history());

app.use(express.static(__dirname + '/dist'));

server.listen(port, function() {
    console.log(`Server is listening on: ${port}`);
});

class Game {

    constructor({ name, rounds, scoreBoard }) {
        this.name = name || new Date().toLocaleDateString("ru-RU");
        this.rounds = rounds || [];
        this.scoreBoard = scoreBoard || {};
        this.currentRoundId = -1;
        this.roundStarted = false;
    }

    startGame() {
        this.scoreBoard = {};
        this.currentRoundId = -1;
        this.nextRound();
    }

    prevRound() {
        if (this.currentRoundId < 1) return;
        this.currentRoundId--;
        this.roundStarted = false;
    }

    nextRound() {
        if (this.currentRoundId >= this.rounds.length-1) return;
        this.currentRoundId++;
        this.roundStarted = false;
    }

    startRound() {
        if (this.currentRoundId < 0) return;
        this.rounds[this.currentRoundId].attempts = {};
        this.roundStarted = true;
        if (this.currentRoundId === 0)
        {
            let date = new Date;
            this.countdownDate = date.setSeconds(date.getSeconds() + 5);
        }
    }

    revealAnswer(socket) {
        if (this.currentRoundId < 0 || !this.roundStarted) return;

        const answer = this.rounds[this.currentRoundId].answer;

        socket.emit('reveal_answer', answer);
        socket.broadcast.emit('reveal_answer', answer);
    }

    registerAttempt(participant) {
        const currentRound = this.rounds[this.currentRoundId];
        if (!currentRound || currentRound.attempts[participant] || !this.roundStarted) return;

        currentRound.attempts[participant] = { date: (new Date() - this.countdownDate) / 1000 };
    }

    score(participant) {
        const currentRound = this.rounds[this.currentRoundId];
        if (!currentRound || !currentRound.attempts) return;
        const attempt = currentRound.attempts[participant];
        if (attempt.correct) return;

        if (!(participant in this.scoreBoard)) this.scoreBoard[participant] = 0;
        this.scoreBoard[participant]++;
        attempt.correct = true;
    }

    sync(socket) {
        const currentRound = this.rounds[this.currentRoundId];

        const publicData = {
            scoreBoard: this.scoreBoard,
            attempts: (currentRound && currentRound.attempts) ? currentRound.attempts : {},
            question: currentRound ? currentRound.question : '',
            countdownDate: this.countdownDate,
            roundStarted: this.roundStarted,
        };

        socket.emit('sync', publicData);
        socket.broadcast.emit('sync', publicData);
    }

    save() {
        //TODO: Store and load games in JSON files.
    }
}

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

const password = process.env.password || 123;

const clients = new Set;

io.on('connection', socket => {

    let currentClient = '';
    let isAdmin = false;

    console.log('Client connected');

    socket.on('authorize', auth => {

        if (!auth || typeof auth !== 'string' || clients.has(auth)) return;

        currentClient = auth;

        clients.add(currentClient);

        socket.emit('auth_success', currentClient);

        currentGame.sync(socket);
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
        'start_round'
    ];

    commonActions.forEach(action => {
        const actionCamelCase = action.replace(/_([a-z])/g, function (g) { return g[1].toUpperCase(); });
        socket.on(action, () => {
            currentGame[actionCamelCase]();
            currentGame.sync(socket);
        });
    });

    socket.on('attempt', () => {
        currentGame.registerAttempt(currentClient);
        currentGame.sync(socket);
    });

    /*
    *
    * Admin methods
    *
    * */

    socket.on('admin', function (adminPassword) {

        if (adminPassword !== password) return;

        isAdmin = true;

        socket.emit('admin_success', adminPassword);
    });

    socket.on('reveal_answer', () => {
        currentGame.revealAnswer(socket);
    });

    socket.on('score', (participant) => {
        currentGame.score(participant);
        currentGame.sync(socket);
    });
});