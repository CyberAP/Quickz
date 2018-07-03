<template>
    <BaseLayout>
        <Game presentation></Game>
    </BaseLayout>
</template>

<script>
    import BaseLayout from '@/layouts/BaseLayout';
    import Game from '@/components/Game';

    export default {
        name: 'Presentation',
        components: {
            BaseLayout,
            Game
        }
    }
</script>