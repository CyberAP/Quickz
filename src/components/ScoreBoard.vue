<template>
    <div class="scoreboard">
        <h6 class="scoreboard--title">Scores</h6>
        <div class="scoreboard--table">
            <div class="scoreboard--row" v-for="row in processedData">
                <div class="scoreboard--name">
                    {{row.name}}
                </div>
                <div class="scoreboard--score">
                    {{row.score}}
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        name: 'ScoreBoard',
        props: {
            data: {
                type: Object,
                required: true,
                default: () => {}
            },
            sortBy: {
                type: String,
            },
            sortValueTransform: {
                type: Function,
            }
        },
        computed: {
            processedData() {
                const data = Object.keys(this.data).map((key) => { return { name: key, score: this.data[key] } });

                if (!this.sortBy) return data;

                return data.sort((a,b) => {
                    let leftVal = a[this.sortBy];
                    let rightVal = b[this.sortBy];
                    if (this.sortValueTransform)
                    {
                        leftVal = this.sortValueTransform(leftVal);
                        rightVal = this.sortValueTransform(rightVal);
                    }
                    return leftVal > rightVal;
                });
            },
        }
    }
</script>

<style scoped>

    .scoreboard
    {
        margin: 20px 0;
    }

    .scoreboard--title
    {
        margin: 10px 0;
        font-size: 36px;
    }

    .scoreboard--row
    {
        display: flex;
        align-items: baseline;
    }

    .scoreboard--score
    {
        margin-left: auto;
    }
</style>
