require('dotenv').config();
import fs from 'fs';
import path from 'path';
import express from 'express';
import http from 'http';
import socket from 'socket.io';
import history from 'connect-history-api-fallback';
import { promisify } from 'util';
import Game from './Game';

const app = express();
const server = http.createServer(app);
const io = socket(server);
const port = process.env.VUE_APP_SOCKET_PORT || 3000;

const readDir = promisify(fs.readdir);
const readFile = promisify(fs.readFile);
const writeFile = promisify(fs.writeFile);
const unlink = promisify(fs.unlink);
const stat = promisify(fs.stat);

const configPath = path.join(__dirname, 'server.config.json');
let serverConfig;

app.use(history());
app.use(express.static(path.join(__dirname, '../', 'dist')));

server.listen(port, function() {
    console.log(`Server is listening on: ${port}`);
});

let savedGames;
let currentGame;
const gamesPath  = 'games';
const password = process.env.password || '123';
const clients = new Set;

const main = (_ => {
    return loadSavedGames()
        .catch(handleError)

        .then(loadConfig)
        .catch(handleError)

        .then(loadLastGame)
        .catch(handleError);
})();

io.on('connection', socket => {

    let currentClient = '';
    let isAdmin = false;

    const sync = () => {
        return new Promise((resolve, reject) => {
            if (!currentGame) reject('No game to sync');
            const gameData = currentGame.publicData;
            if (!gameData) reject('No game data available');
            console.log('Game synced');
            resolve(syncGameData(socket, gameData));
        });
    };

    const syncAdmin = () => {
        return new Promise((resolve, reject) => {
            if (!isAdmin) reject('Not an admin');
            resolve(syncAdminData(socket, { savedGames }));
        });
    };

    console.log('Client connected');

    main
        .then(sync)
        .catch(handleError)

        .then(syncAdmin)
        .catch(handleError);

    socket.on('authorize', auth => {
        if (!auth || typeof auth !== 'string' || clients.has(auth)) return socket.emit('auth_fail');

        currentClient = auth;
        clients.add(currentClient);
        socket.emit('auth_success', currentClient);

        console.log(`Client ${currentClient} authorized`);
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
        'end_game'
    ];

    commonActions.forEach(action => {
        const actionCamelCase = action.replace(/_([a-z])/g, g => g[1].toUpperCase());
        socket.on(action, data => {
            if (!currentGame) return;
            currentGame[actionCamelCase](data);
            sync().catch(handleError);
        });
    });

    socket.on('attempt', () => {
        if (!currentGame || !currentClient) return;
        currentGame.registerAttempt(currentClient);
        sync().catch(handleError);
    });


    socket.on('admin', function (adminPassword) {
        if (adminPassword !== password) return socket.emit('admin_fail');
        isAdmin = true;
        socket.emit('admin_success', adminPassword);
        console.log('Admin connected');
        syncAdmin().catch(handleError);
    });

    socket.on('score', participant => {
        if (!currentGame || !isAdmin) return;
        currentGame.score(participant);
        sync().catch(handleError);
    });

    socket.on('load_game', gameName => {
        if (!isAdmin) return;
        loadGame(gameName)
            .catch(handleError)

            .then(sync)
            .catch(handleError);
    });

    socket.on('save_game', game => {
        if (!isAdmin) return;
        saveGame(game)
            .catch(handleError)

            .then(loadSavedGames)
            .catch(handleError)

            .then(syncAdmin)
            .catch(handleError);
    });

    socket.on('delete_game', gameName => {
        if (!isAdmin) return;
        deleteGame(gameName)
            .catch(handleError)

            .then(loadSavedGames)
            .catch(handleError)

            .then(syncAdmin)
            .catch(handleError);
    });
});

async function loadSavedGames() {
    const games = readDir(gamesPath)
        .catch(handleError)
        .then(files => {
            const promises = files.map(file => {
                const filePath = `${gamesPath}/${file}`;
                return stat(filePath)
                    .catch(handleError)
                    .then(stats => {
                        if (stats.isDirectory()) return;
                        return readFile(filePath)
                            .catch(handleError)
                            .then(fileData => {
                                const savedGame = JSON.parse(fileData);
                                const fileName = file.replace(/\.[^/.]+$/, '');
                                return Object.assign(savedGame, { name: fileName });
                            });
                    })
                    .catch(handleError);
            });
            return Promise.all(promises);
        });
    savedGames = (await games).filter(game => game);
    return games;
}

function loadGame(gameName) {
    return new Promise((resolve, reject) => {
        if (!savedGames) return reject('Games are not ready yet');

        const foundGame = savedGames.find(game => game.name === gameName);
        if (!foundGame) return reject(`Game ${gameName} not found`);

        currentGame = new Game(foundGame);
        console.log(`Game ${currentGame.name} loaded`);
        if (serverConfig && serverConfig.lastGameName !== gameName) saveConfig({ lastGameName: gameName });
        resolve(currentGame);
    });
}

function saveGame(game) {
    const filename = `${gamesPath}/${game.name || new Date().toLocaleDateString("ru-RU")}.json`;

    return writeFile(filename, JSON.stringify(game), 'utf8')
        .catch(handleError)
        .then(_ => game);
}

function deleteGame(gameName) {
    const filename = `${gamesPath}/${gameName}.json`;

    return unlink(filename).catch(handleError).then(loadSavedGames);
}

function loadConfig() {
    return readFile(configPath)
        .catch(handleError)
        .then(data => serverConfig = JSON.parse(data));
}

function saveConfig(newParams) {
    const newConfig = Object.assign(serverConfig, newParams);

    return writeFile(configPath, JSON.stringify(newConfig), 'utf8')
        .catch(handleError)
        .then(_ => serverConfig = newConfig);
}

function loadLastGame(config) {
    const lastGameName = config.lastGameName;
    return new Promise((resolve, reject) => {
        if (lastGameName) {
            if (savedGames.length) {
                resolve(loadGame(lastGameName));
            }
        }
        reject('No last game recorded');
    });
}

function broadcast(socket, eventName, ...data) {
    socket.emit(eventName, ...data);
    socket.broadcast.emit(eventName, ...data);
}

function syncAdminData(socket, adminData) {
    return new Promise((resolve, reject) => {
        if (!adminData) reject('No admin data passed to sync');
        socket.emit('admin_sync', adminData);
        resolve(adminData);
    });
}

function syncGameData(socket, gameData) {
    return new Promise((resolve, reject) =>  {
        if (!gameData) reject('No data for sync');
        broadcast(socket, 'sync', gameData);
        resolve(gameData);
    });
}

function handleError(error) {
    console.log(error);
}