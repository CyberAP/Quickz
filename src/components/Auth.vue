<template>
    <div class="auth">
        <div class="page-width">
            <form class="auth--form" @submit.prevent="$emit('auth', auth); auth = '';">
                <h6 class="auth--title" v-if="title">{{title}}</h6>
                <input class="auth--input" v-model="auth">
                <button class="auth--button button">Log in</button>
            </form>
        </div>
    </div>
</template>
<script>
    export default {
        name: 'Auth',
        props: {
            title: {
                type: String
            }
        },
        data() {
            return {
                auth: ''
            }
        }
    }
</script>

<style scoped>
    .auth
    {
        margin: 20px 0;
    }

    .auth--title
    {
        margin: 25px 0 15px;
        font-size: 20px;
    }

    .auth--input
    {
        display: block;
        margin: 10px 0;
        max-width: 300px;
    }
</style>
