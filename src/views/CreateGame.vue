<template>
    <div class="create-game">
        <GameEdit></GameEdit>
    </div>
</template>

<script>
    import GameEdit from '@/components/GameEdit';

    export default {
        name: 'Admin',
        components: {
            GameEdit
        },
    }
</script>
