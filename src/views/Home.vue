<template>
    <MainLayout>
        <div class="home">

            <GameControls v-if="state.isAdmin"/>

            <Auth title="Enter your team's name" @auth="dispatch('authorize', $event)" v-if="!state.auth"/>

            <Game v-if="(state.auth || state.isAdmin)"></Game>

        </div>
    </MainLayout>
</template>

<script>
    import MainLayout from '@/layouts/MainLayout';
    import Game from '@/components/Game';
    import GameControls from "@/components/GameControls";
    import Auth from "@/components/Auth";

    export default {
        name: 'Home',
        components: {
            Auth,
            GameControls,
            MainLayout,
            Game,
        },
        data() {
            return {
                countdown: 0,
                showScoreboard: false
            }
        },
    }
</script>
