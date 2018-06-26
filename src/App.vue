<template>
    <div id="app">
        <router-view/>
    </div>
</template>

<script>
    require('normalize.css');

    export default {
        name: 'App'
    }
</script>

<style>

    *,*::before,*::after { box-sizing: inherit; }

    html
    {
        box-sizing: border-box;
    }

    body
    {
        overflow-y: scroll;
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol";
        font-size: 20px;
        line-height: 1.25;
    }

</style>
