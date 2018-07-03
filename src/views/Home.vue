<template>
    <BasicLayout>
        <div class="home">
            <form
                    class="auth"
                    @submit.prevent="dispatch('authorize', auth); auth = '';"
                    v-if="!state.auth"
            >
                <input v-model="auth">
                <button>Log in</button>
            </form>
            <div class="game">

                <div class="controls" v-if="state.isAdmin">
                    <button @click="dispatch('startGame')">Start game</button>
                    <button @click="dispatch('prevRound')">Prev round</button>
                    <button @click="dispatch('nextRound')">Next round</button>
                    <button @click="dispatch('startRound')">Start round</button>
                    <button @click="dispatch('toggleAnswer')">Toggle answer</button>
                    <button @click="dispatch('endGame')">End game</button>
                </div>

                <Game v-if="(state.auth || state.isAdmin) && !state.game.gameEnded"></Game>

                <ScoreBoard v-if="state.game.gameEnded"></ScoreBoard>

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
