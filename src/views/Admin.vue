<template>
    <MainLayout>
        <div class="admin">
            <Auth @auth="dispatch('admin', $event)" v-if="!state.isAdmin"/>
            <div class="admin--main" v-else>
                <router-view></router-view>
            </div>
        </div>
    </MainLayout>
</template>

<script>
    import MainLayout from '@/layouts/MainLayout';
    import Auth from "@/components/Auth";

    export default {
        name: 'Admin',
        components: {
            Auth,
            MainLayout
        },
        data() {
            return {
                auth: ''
            }
        }
    }
</script>

<style scoped>
    .admin
    {
        margin: 20px 0;
    }
</style>
