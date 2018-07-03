<template>
    <div class="layout">
        <div v-if="$slots.header" class="header">
            <div class="header--container page-width">
                <slot name="header"></slot>
            </div>
        </div>
        <div class="contents">
            <div class="page-width">
                <slot></slot>
            </div>
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

    .team-name
    {
        margin-right: 20px;
        font-weight: 500;
    }

    .nav--link
    {
        margin-right: 10px;
        text-decoration: none;
        color: cornflowerblue;
    }

    .router-link-exact-active
    {
        color: #000;
    }

    .logOut
    {
        padding: 4px 10px;
        margin-left: auto;
        border: thin solid rgba(0,0,0,0.5);
        border-radius: 4px;
        background: transparent;
    }

    .contents
    {
        margin: 20px 0;
    }
</style>
