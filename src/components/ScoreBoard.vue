<template>
    <div class="scoreboard">
        <h6 class="scoreboard--title">Scores</h6>
        <div class="scoreboard--table">
            <div class="scoreboard--row" v-for="row in state.game.scoreBoard" :key="row.name">
                <div class="scoreboard--name">
                    {{row.name}}
                </div>
                <div class="scoreboard--score">
                    {{row.score}}
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        name: 'ScoreBoard',
    }
</script>

<style scoped>

    .scoreboard
    {
        margin: 20px 0;
    }

    .scoreboard--title
    {
        margin: 10px 0;
        font-size: 36px;
    }

    .scoreboard--row
    {
        display: flex;
        align-items: baseline;
    }

    .scoreboard--score
    {
        margin-left: auto;
    }
</style>
