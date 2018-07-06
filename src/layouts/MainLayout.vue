<template>
    <BaseLayout>
        <template slot="header">
            <div class="team-name" v-if="state.auth">{{state.auth}}</div>
            <div v-if="state.isAdmin" class="nav">
                <router-link class="nav--link nav--link__home" to="/">Home</router-link>
                <router-link class="nav--link" to="/admin">Admin</router-link>
                <router-link class="nav--link" to="/presentation">Presentation</router-link>
            </div>
            <button class="logOut" v-if="state.auth" @click="dispatch('logOut')">Log out</button>
        </template>
        <slot></slot>
    </BaseLayout>
</template>

<script>
    import BaseLayout from '@/layouts/BaseLayout';

    export default {
        name: 'MainLayout',
        components: {
            BaseLayout
        }
    }
</script>

<style>
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

    .router-link-active:not(.nav--link__home),
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
</style>
