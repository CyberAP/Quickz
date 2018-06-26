<template>
    <BasicLayout>
        <div class="home">
            <div class="auth" v-if="!state.auth">
                <input v-model="auth">
                <button @click="dispatch('authorize', auth); auth = '';">Log in</button>
            </div>
            <div class="game" v-else>

                <button @click="dispatch('startGame')">Start game</button>
                <button @click="dispatch('prevRound')">Prev round</button>
                <button @click="dispatch('nextRound')">Next round</button>
                <button @click="dispatch('startRound')">Start round</button>
                <button
                        @click="state.answer ? dispatch('clearAnswer') : dispatch('revealAnswer')"
                >{{state.answer ? 'Hide' : 'Reveal'}} answer</button>
                <button @click="showScoreboard = !showScoreboard">Toggle scoreboard</button>

                <Game v-if="!showScoreboard"></Game>

                <ScoreBoard :data="state.game.scoreBoard" v-if="showScoreboard && state.game.scoreBoard"></ScoreBoard>

            </div>
        </div>
    </BasicLayout>
</template>

<script>
    import BasicLayout from '@/layouts/BasicLayout';
    import Game from '@/components/Game';
    import ScoreBoard from '@/components/ScoreBoard';

    export default {
        name: 'home',
        components: {
            BasicLayout,
            Game,
            ScoreBoard,
        },
        data() {
            return {
                auth: '',
                countdown: 0,
                showScoreboard: false
            }
        },
    }
</script>
