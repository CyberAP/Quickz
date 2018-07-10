<template>
    <div class="edit-game">
        <GameEdit v-if="savedGame" :savedGame="savedGame"></GameEdit>
        <div class="page-width" v-else>
            <div>Game №{{gameId}} not found</div>
        </div>
    </div>
</template>

<script>
    import GameEdit from '@/components/GameEdit';

    export default {
        name: 'Admin',
        components: {
            GameEdit
        },
        data() {
            return {

            }
        },
        computed: {
            gameId() {
               return +this.$route.params.gameId;
            },
            savedGame() {
                return this.state?.adminData?.savedGames?.find(game => game.id === this.gameId);
            }
        }
    }
</script>
