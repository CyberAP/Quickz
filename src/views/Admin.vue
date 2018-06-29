<template>
    <BasicLayout>
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
                <GamesList></GamesList>
            </div>
        </div>
    </BasicLayout>
</template>

<script>
    import BasicLayout from '@/layouts/BasicLayout';
    import GamesList from '@/components/GamesList';

    export default {
        name: 'Admin',
        components: {
            BasicLayout,
            GamesList
        },
        data() {
            return {
                auth: ''
            }
        }
    }
</script>
