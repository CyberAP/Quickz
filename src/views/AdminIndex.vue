<template>
    <div class="admin-index">
        <div class="page-width">
            <button class="button" @click="$router.push({ name: 'CreateGame' })">Create new game</button>
        </div>
        <GamesList></GamesList>
    </div>
</template>

<script>
    import GamesList from '@/components/GamesList';

    export default {
        name: 'AdminIndex',
        components: {
            GamesList
        },
        data() {
            return {
                auth: ''
            }
        }
    }
</script>
