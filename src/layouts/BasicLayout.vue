<template>
    <div class="layout">
        <div class="header">
            <div class="header--container page-width">
                <div class="team-name" v-if="state.auth">{{state.auth}}</div>
                <div class="nav">
                    <router-link class="nav--link" to="/">Home</router-link>
                    <router-link class="nav--link" to="/admin">Admin</router-link>
                    <router-link class="nav--link" to="/presentation">Presentation</router-link>
                </div>
                <button class="logOut" v-if="state.auth" @click="dispatch('logOut')">Log out</button>
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
        name: 'basicLayout',
    }
</script>

<style>
    .page-width
    {
        max-width: 800px;
        margin-left: auto;
        margin-right: auto;
        padding-left: 20px;
        padding-right: 20px;
    }

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
