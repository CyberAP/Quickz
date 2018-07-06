<template>
    <div class="game">
        <div class="page-width">
            <div class="game--container">
                <div class="game--header">
                    <div class="game--name"><input v-model="game.name"></div>
                </div>
                <div class="game--teams">
                    <h6>Teams</h6>
                    <div class="game--team" v-for="team in game.teams">
                        <div class="game--team--remove">
                            <button @click="removeTeam(team)">Remove team</button>
                        </div>
                        <div class="game--team--name">
                            <input v-model="team.name">
                        </div>
                        <div class="game--team--initial-score">
                            <input type="number" min="0" v-model="team.initialScore">
                        </div>
                    </div>
                    <div class="game--teams--add">
                        <button @click="addTeam()">Add team</button>
                    </div>
                </div>
                <div class="game--rounds">
                    <h6>Rounds</h6>
                    <div class="game--round" v-for="round in game.rounds">
                        <div class="game--round--remove">
                            <button @click="removeRound(round)">Remove round</button>
                        </div>
                        <div class="game--round-type">
                            <label>
                                <input type="checkbox" v-model="round.multiple">
                                Multiple questions
                            </label>
                        </div>
                        <div class="game--question">
                            <input v-model="round.question">
                        </div>
                        <div class="game--media">
                            <MediaEdit v-model="round.questionMedia" />
                        </div>
                        <div class="game--answer" v-if="!round.multiple">
                            <input v-model="round.answer">
                        </div>
                        <div class="game--answers" v-if="round.multiple">
                            <div class="game--answers--answer" v-for="answer in round.answers">
                                <div class="game--answers--is-correct">
                                    <input type="checkbox" v-model="answer.isCorrect">
                                </div>
                                <div class="game--answers--text">
                                    <input v-model="answer.text">
                                </div>
                                <div class="game--answers--remove">
                                    <button @click="removeAnswer(round, answer)">Remove answer</button>
                                </div>
                            </div>
                            <div class="game--answers--add">
                                <button @click="addAnswer(round)">Add answer</button>
                            </div>
                        </div>
                        <div class="game--media">
                            <MediaEdit v-model="round.answerMedia" />
                        </div>
                    </div>
                    <div class="game--rounds--add">
                        <button @click="addRound()">Add round</button>
                    </div>
                </div>
                <div class="game--actions">
                    <button @click="saveGame()">Save game</button>
                    <button @click="$router.go(-1)">Cancel</button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import MediaEdit from "@/components/MediaEdit";

    const defaultGame = () => ({
        rounds: [],
        teams: [],
    });

    export default {
        name: 'GameEdit',
        components: {
            MediaEdit
        },
        props: {
            savedGame: {
                type: Object,
            }
        },
        data() {
            return {
                game: defaultGame()
            };
        },
        created() {
            if (this.savedGame) this.game = this.savedGame;
        },
        methods: {
            addTeam() {
                this.$set(this.game, 'teams', [...this.game.teams, { name: '', initialScore: 0 }]);
            },
            removeTeam(team) {
                this.$delete(this.game.teams, this.game.teams.indexOf(team));
            },
            addRound() {
                this.$set(this.game, 'rounds', [...this.game.rounds, {
                    question: '',
                    answer: '',
                    answers: [],
                    multiple: false
                }]);
            },
            removeRound(round) {
                this.$delete(this.game.rounds, this.game.rounds.indexOf(round));
            },
            addAnswer(round) {
                this.$set(round, 'answers', [...round.answers, { text: '', isCorrect: false, }]);
            },
            removeAnswer(round, answer) {
                const answers = round.answers;
                this.$delete(answers, answers.indexOf(answer));
            },
            saveGame() {
                this.dispatch('saveGame', this.game);
                this.game = defaultGame();
                this.$router.push({ name: 'AdminIndex' });
            }
        }
    }
</script>

<style scoped>
    .game
    {
    }

    .game--container
    {
        margin: 20px 0;
        padding: 20px;
        border: thin solid rgba(0,0,0,0.2);
        border-radius: 8px;
    }

    .game--header
    {
        display: flex;
        justify-content: space-between;
    }
</style>