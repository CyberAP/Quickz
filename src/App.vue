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

    img,
    audio,
    video
    {
        max-width: 100%;
    }

    .page-width
    {
        max-width: 1200px;
        margin-left: auto;
        margin-right: auto;
        padding-left: 20px;
        padding-right: 20px;
    }

    .button
    {
        padding: 5px 12px;
        border: none;
        border-radius: 6px;
        background-color: rgb(103, 163, 238);
        color: #fff;
    }

    .button-list
    {
        margin: 10px -5px;
    }

    .button-list--button
    {
        margin: 5px;
    }

</style>
