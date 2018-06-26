<template>
    <div class="attempts-list">
        <div class="attempts-list--row" :class="{'attempts-list--row__correct': row.correct}" v-for="row in sortedData">
            <div class="attempts-list--name">
                {{row.name}}
            </div>
            <div class="attempts-list--date">
                {{row.date}}s
            </div>
            <div class="attempts-list--actions">
                <button
                        v-if="state.isAdmin && controls"
                        @click="dispatch('score', row.name)"
                >Correct</button>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        name: 'AttemptsList',
        props: {
            controls: {
                type: Boolean,
                required: false
            },
            data: {
                type: Object,
                required: true,
                default: () => {}
            }
        },
        computed: {
            sortedData() {
                const data = Object.keys(this.data).map((key) => { return { name: key, ...this.data[key] } });

                return data.sort((a,b) => { return new Date(a.date) > new Date(b.date) });
            },
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
