<template>
    <BasicLayout>
        <Game presentation></Game>
    </BasicLayout>
</template>

<script>
    import BasicLayout from '@/layouts/BasicLayout';
    import Game from '@/components/Game';

    export default {
        name: 'Presentation',
        components: {
            BasicLayout,
            Game
        }
    }
</script>