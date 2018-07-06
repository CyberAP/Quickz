require('dotenv').config();
import fs from 'fs';
import url from 'url';
import path from 'path';
import express from 'express';
import http from 'http';
import socket from 'socket.io';
import history from 'connect-history-api-fallback';
import { promisify } from 'util';
import generate from 'nanoid/generate'
import dictionary from 'nanoid-dictionary';
import Game from './Game';

const app = express();
const server = http.createServer(app);
const io = socket(server);
const port = process.env.VUE_APP_SOCKET_PORT || 3000;

const readDir   = promisify(fs.readdir);
const readFile  = promisify(fs.readFile);
const writeFile = promisify(fs.writeFile);
const unlink    = promisify(fs.unlink);
const stat      = promisify(fs.stat);
const mkdir     = promisify(fs.mkdir);

const mediaFolder = 'media';

const configPath = path.join(__dirname, 'server.config.json');
const distPath   = path.join(__dirname, '../', 'dist');
const gamesPath  = path.join(__dirname, '../', 'games');
const mediaPath  = path.join(__dirname, '../', mediaFolder);

let serverConfig;
const createDefaultConfig = () => ({ lastGameId: 0 });

app.use(history());
app.use(express.static(distPath));
app.use('/media', express.static(mediaPath));

server.listen(port, () => console.log(`Server is listening on: ${port}`));

let savedGames;
let currentGame;

const password = process.env.password || '123';
const clients = new Set;

const main = (_ => {
    return stat(gamesPath)
        .catch(_ => mkdir(gamesPath))
        .then(_ => stat(mediaPath))
        .catch(_ => mkdir(mediaPath))
        .then(loadSavedGames)
        .then(loadConfig)
        .then(loadLastGame)
        .catch(handleError);
})();

io.on('connection', socket => {

    let currentClient = '';
    let isAdmin = false;

    const sync = () => {
        return new Promise((resolve, reject) => {
            resolve(syncGameData(socket, currentGame && currentGame.publicData));
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

    const gameActions = [
        'start_game',
        'prev_round',
        'next_round',
        'start_round',
        'toggle_answer',
        'end_game'
    ];

    gameActions.forEach(action => {
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
            .then(_ => socket.emit('game_loaded'))
            .then(sync)
            .catch(handleError);
    });

    socket.on('unload_game', _ => {
        if (!isAdmin) return;
        unloadGame()
            .then(_ => socket.emit('game_unloaded'))
            .then(sync)
            .catch(handleError);
    });

    socket.on('save_game', game => {
        if (!isAdmin) return;
        saveGame(game)
            .then(_ => socket.emit('game_saved'))
            .then(loadSavedGames)
            .then(syncAdmin)
            .catch(handleError);
    });

    socket.on('delete_game', gameName => {
        if (!isAdmin) return;
        deleteGame(gameName)
            .then(_ => socket.emit('game_deleted'))
            .then(loadSavedGames)
            .then(syncAdmin)
            .catch(handleError);
    });
});

async function loadSavedGames() {
    const games = readDir(gamesPath)
        .catch(handleError)
        .then(fileNames => {
            if (!fileNames) return;
            const promises = fileNames
                .filter(fileName => fileName.match(/\.json$/))
                .map(fileName => {
                    const filePath = `${gamesPath}/${fileName}`;
                    return stat(filePath)
                        .catch(handleError)
                        .then(stats => {
                            if (stats.isDirectory()) return;
                            return readFile(filePath)
                                .catch(handleError)
                                .then(fileData => {
                                    return JSON.parse(fileData);
                                });
                        })
                        .catch(handleError);
                });
            return Promise.all(promises);
        });
    return savedGames = await games;
}

function loadGame(gameId) {
    return new Promise((resolve, reject) => {
        if (!savedGames) return reject('Games are not ready yet');

        const foundGame = savedGames.find(game => game.id === gameId);
        if (!foundGame) return reject(`Game №${gameId} not found`);

        currentGame = new Game(foundGame);
        console.log(`Game ${currentGame.name} loaded`);
        if (serverConfig && serverConfig.lastLoadedGameId !== gameId) saveConfig({ lastLoadedGameId: gameId });
        resolve(currentGame);
    });
}

function unloadGame() {
    return new Promise((resolve, reject) => {
        if (!currentGame) reject('No game is loaded yet');
        console.log(`Game ${currentGame.name} unloaded`);
        currentGame = undefined;
        resolve(saveConfig({ lastLoadedGameId: undefined }));
    });
}

async function saveGame(game) {
    let newId;
    if (!game.id) {
        const lastId = (serverConfig || await loadConfig()).lastGameId;
        if (!lastId) await saveConfig({ lastGameId: 0 });

        game.id = newId = lastId + 1;
    }

    const filename = path.join(gamesPath, `${game.id}.json`);

    if (Array.isArray(game.rounds))
    {
        const rounds = game.rounds.map(async round => {
            if (!round) return;
            const mediaFields = ['questionMedia', 'answerMedia'];

            const mediaPaths =
                await Promise.all(
                    mediaFields
                        .map(field => round[field])
                        .map(media => {
                            if (!media || !media.file || typeof media.file === 'string') return;
                            return saveMedia(media, game.id);
                        }));

            mediaPaths.forEach((mediaPath, key) => {
                if (!mediaPath) return;
                const fieldName = mediaFields[key];
                const mediaField = round[fieldName];
                round[fieldName] = Object.assign(mediaField, { file: mediaPath });
            });

            return round;
        });
        game.rounds = await Promise.all(rounds);
    }

    return writeFile(filename, JSON.stringify(game), 'utf8')
        .then(_ => newId && saveConfig({ lastGameId: newId }))
        .then(_ => game);
}

async function saveMedia(media, gameId) {
    if (!media || !gameId) return;

    const extension = media.extension;
    let filename = generate(dictionary.filename, 20);
    if (extension) filename += `.${extension}`;

    const gamePath = `${gameId}`;
    const gamePathAbsolute = path.join(mediaPath, gamePath);
    const relativePath = path.join(gamePath, filename);
    const absolutePath = path.join(mediaPath, relativePath);

    await stat(gamePathAbsolute)
        .catch(_ => mkdir(gamePathAbsolute));

    return writeFile(absolutePath, media.file)
        .then(_ => url.resolve('/', path.join(mediaFolder, relativePath)));
}

function deleteGame(gameId) {
    const filename = path.join(gamesPath, `${gameId}.json`);

    return unlink(filename);
}

function loadConfig() {
    return readFile(configPath)
        .then(data => serverConfig = JSON.parse(data))
        .catch(err => {
            console.log('No config found. Creating one.');
            return writeFile(configPath, JSON.stringify(createDefaultConfig()), 'utf8')
                .then(loadConfig)
        });
}

function saveConfig(newParams) {
    const newConfig = Object.assign(serverConfig, newParams);

    return writeFile(configPath, JSON.stringify(newConfig), 'utf8')
        .then(_ => serverConfig = newConfig);
}

function loadLastGame(config) {
    const lastGameId = config.lastGameId;
    return new Promise((resolve, reject) => {
        if (lastGameId && savedGames.length) resolve(loadGame(lastGameId));
        reject('No last game recorded');
    });
}

function syncAdminData(socket, adminData) {
    return new Promise((resolve, reject) => {
        socket.emit('admin_sync', adminData);
        resolve(adminData);
    });
}

function syncGameData(socket, gameData) {
    return new Promise((resolve, reject) =>  {
        broadcast(socket, 'sync', gameData);
        resolve(gameData);
    });
}

function broadcast(socket, eventName, ...data) {
    socket.emit(eventName, ...data);
    socket.broadcast.emit(eventName, ...data);
}

function handleError(error) {
    console.log(error);
}