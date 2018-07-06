<template>
    <div class="layout">
        <div v-if="$slots.header" class="header">
            <div class="header--container page-width">
                <slot name="header"></slot>
            </div>
        </div>
        <div class="contents">
            <slot></slot>
        </div>
    </div>
</template>

<script>
    export default {
        name: 'BaseLayout',
    }
</script>

<style>
    .header
    {
        padding: 10px 0;
        border-bottom: thin solid rgba(0,0,0,.2);
    }

    .header--container
    {
        display: flex;
        align-items: baseline;
    }
</style>
