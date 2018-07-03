<template>
    <BaseLayout>
        <template slot="header">
            <div class="team-name" v-if="state.auth">{{state.auth}}</div>
            <div v-if="state.isAdmin" class="nav">
                <router-link class="nav--link" to="/">Home</router-link>
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
</style>
