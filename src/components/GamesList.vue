<template>
    <div class="games-list">
        <div class="games-list--items">
            <div class="games-list--item" v-for="game in getters.games">
                <div class="games-list--item--name">{{game.name}}</div>
                <div class="games-list--item--rounds" v-if="game.rounds">
                    <div class="games-list--item--round" v-for="round in game.rounds">
                        <div class="games-list--item--question">
                            {{round.question}}
                        </div>
                        <div class="games-list--item--answer">
                            {{round.answer}}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        name: 'GamesList'
    }
</script>

<style scoped>

</style>