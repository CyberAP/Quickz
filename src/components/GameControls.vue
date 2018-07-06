<template>
    <div class="game-controls">
        <div class="page-width">
            <div class="button-list" v-if="state.game">
                <button class="button button-list--button" @click="dispatch('startGame')">Start game</button>
                <button class="button button-list--button" @click="dispatch('prevRound')">Prev round</button>
                <button class="button button-list--button" @click="dispatch('nextRound')">Next round</button>
                <button class="button button-list--button" @click="dispatch('startRound')">Start round</button>
                <button class="button button-list--button" @click="dispatch('toggleAnswer')">Toggle answer</button>
                <button class="button button-list--button" @click="dispatch('endGame')">End game</button>
                <button class="button button-list--button" v-if="state.game" @click="dispatch('unloadGame')">Unload game</button>
            </div>
            <div v-else>
                Game is not loaded
            </div>
        </div>
    </div>
</template>
<script>
    export default {
        name: 'GameControls'
    }
</script>

<style>
    .game-controls
    {
        padding: 10px 0;
        background-color: rgba(129, 173, 238, 0.05);
    }
</style>