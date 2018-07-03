<template>
    <MainLayout>
        <div class="create-game">
            <GameEdit v-if="savedGame" :savedGame="savedGame"></GameEdit>
            <div v-else>Game '{{gameName}}' not found</div>
        </div>
    </MainLayout>
</template>

<script>
    import MainLayout from '@/layouts/MainLayout';
    import GameEdit from '@/components/GameEdit';

    export default {
        name: 'Admin',
        components: {
            MainLayout,
            GameEdit
        },
        data() {
            return {
                savedGame: undefined,
                gameName: this.$route.params.gameName
            }
        },
        created() {
            if (this.state.adminData && Array.isArray(this.state.adminData.savedGames))
            {
                this.savedGame = this.state.adminData.savedGames.find(game => game.name === this.gameName);
            }
        }
    }
</script>
