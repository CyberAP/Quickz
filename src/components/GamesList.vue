<template>
    <div class="games-list">
        <div class="page-width">
            <div class="games-list--items">
                <div class="game" v-for="game in getters.games" :key="game.id">
                    <div class="game--header">
                        <div class="game--name">{{game.name}}</div>
                        <div class="game--rounds-count">Rounds: {{game.rounds.length}}</div>
                    </div>
                    <div class="game--rounds" v-if="game.rounds">
                        <div class="game--round" v-for="round in game.rounds" :key="round.question">
                            <div class="game--question">
                                {{round.question}}
                            </div>
                            <div class="game--answer">
                                {{round.answer}}
                            </div>
                        </div>
                    </div>
                    <div class="game--actions">
                        <button v-if="!isGameLoaded(game.id)" @click="dispatch('loadGame', game.id)">Load game</button>
                        <button v-else @click="dispatch('unloadGame')">Unload game</button>
                        <button @click="dispatch('goToEditGame', game.id)">Edit game</button>
                        <button @click="dispatch('deleteGame', game.id)">Delete game</button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        name: 'GamesList',
        methods: {
            isGameLoaded(gameId) {
                return this.state.game?.id === gameId;
            }
        }
    }
</script>

<style scoped>
    .game
    {
        margin: 20px 0;
        padding: 20px;
        border: thin solid rgba(0,0,0,0.2);
        border-radius: 8px;
    }

    .game--header
    {
        display: flex;
        justify-content: space-between;
    }

    .game--round
    {
        display: flex;
    }
</style>