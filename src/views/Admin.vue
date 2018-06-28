<template>
    <BasicLayout>
        <div class="admin">
            <form
                    class="auth"
                    @submit.prevent="dispatch('admin', auth); auth = '';"
                    v-if="!state.isAdmin"
            >
                <input v-model="auth">
                <button>Log in</button>
            </form>
            <div class="game" v-else>
                <div class="controls">
                    <button @click="dispatch('startGame')">Start game</button>
                    <button @click="dispatch('prevRound')">Prev round</button>
                    <button @click="dispatch('nextRound')">Next round</button>
                    <button @click="dispatch('startRound')">Start round</button>
                    <button @click="dispatch('toggleAnswer')">Toggle answer</button>
                    <button @click="showScoreboard = !showScoreboard">Toggle scoreboard</button>
                </div>

                <Game></Game>
            </div>
        </div>
    </BasicLayout>
</template>

<script>
    import BasicLayout from '@/layouts/BasicLayout';
    import Game from '@/components/Game';

    export default {
        name: 'Admin',
        components: {
            BasicLayout,
            Game
        }
    }
</script>
