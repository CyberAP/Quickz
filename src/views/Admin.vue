<template>
    <MainLayout>
        <div class="admin">
            <form
                    class="admin--auth"
                    @submit.prevent="dispatch('admin', auth); auth = '';"
                    v-if="!state.isAdmin"
            >
                <input v-model="auth">
                <button>Log in</button>
            </form>
            <div class="admin--main" v-else>
                <button @click="dispatch('createGame')">Create new game</button>
                <GamesList></GamesList>
            </div>
        </div>
    </MainLayout>
</template>

<script>
    import MainLayout from '@/layouts/MainLayout';
    import GamesList from '@/components/GamesList';

    export default {
        name: 'Admin',
        components: {
            MainLayout,
            GamesList
        },
        data() {
            return {
                auth: ''
            }
        }
    }
</script>
