<template>
    <MainLayout>
        <div class="create-game">
            <GameEdit></GameEdit>
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
    }
</script>
