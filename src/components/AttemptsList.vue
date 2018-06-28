<template>
    <div class="attempts-list">
        <div class="attempts-list--row" :class="{'attempts-list--row__correct': row.correct}" v-for="row in attempts">
            <div class="attempts-list--name">
                {{row.name}}
            </div>
            <div class="attempts-list--date">
                {{row.date}}s
            </div>
            <div class="attempts-list--actions" v-if="admin && state.isAdmin">
                <button
                        @click="dispatch('score', row.name)"
                >Correct</button>
            </div>
        </div>
    </div>
</template>

<script>
    import { mapGetters } from 'vuex';

    export default {
        name: 'AttemptsList',
        props: {
            admin: {
                type: Boolean,
            },
        },
        computed: {
            ...mapGetters(['attempts'])
        }
    }
</script>

<style scoped>
    .attempts-list--row
    {
        display: flex;
        align-items: baseline;
    }

    .attempts-list--row__correct
    {
        color: green;
    }

    .attempts-list--actions
    {
        margin-left: auto;
    }
</style>
