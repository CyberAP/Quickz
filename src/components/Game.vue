<template>
    <div class="game">
        <div class="page-width">
            <div class="countdown" v-if="countdown > 0">
                <span class="countdown--value">{{countdown}}</span>
            </div>
            <div class="game--body">
                <div v-if="!game">
                    Welcome!
                </div>
                <div v-else-if="!game.gameEnded">

                    <div v-if="!game.roundStarted">
                        <h1>Prepare for the round</h1>
                    </div>

                    <h1 class="question" v-if="game.question && countdown < 1 && game.roundStarted">
                        {{game.question}}
                    </h1>

                    <div class="answer" v-if="game.answer && countdown < 1 && game.roundStarted">
                        Answer: {{game.answer}}
                    </div>

                    <button class="submit"
                            @click="dispatch('attempt')"
                            v-if="state.auth && game.attempts && !(state.auth in game.attempts) && countdown < 1 && game.roundStarted && !presentation"
                    >Got the answer!</button>

                    <AttemptsList v-if="game.attempts && countdown < 1 && game.roundStarted" :controls="!presentation" />

                </div>
                <ScoreBoard v-else-if="game.gameEnded" />
            </div>
        </div>
    </div>
</template>

<script>
    import AttemptsList from '@/components/AttemptsList';
    import { TweenLite } from 'gsap/all';

    export default {
        name: 'Game',
        props: {
            presentation: {
                type: Boolean,
            },
            admin: {
                type: Boolean,
            }
        },
        components: {
            AttemptsList
        },
        data() {
            return {
                countdown: 0,
                enterQueue: new Set,
                leaveQueue: new Set,
                animationQueue: new Set
            };
        },
        computed: {
            game() { return this.state.game; },
            countdownDate() { return this.state.game?.countdownDate; }
        },
        watch: {
            countdownDate: {
                handler(value) {
                    if (!value) return;

                    const countdown = () => {
                        this.countdown = Math.round((new Date(value) - new Date()) / 1000);
                        if (this.countdown > 0) { setTimeout(countdown, 1000); }
                    };

                    countdown();
                },
                immediate: true
            }
        },
        methods: {
            enter(el, done) {
                this.animate({
                    el,
                    done,
                    duration: 5,
                    animation: 'enter'
                });
            },
            leave(el, done) {
                this.animate({
                    el,
                    done,
                    duration: 3,
                    animation: 'leave'
                });
            },
            animate({ el, done, duration, animation }) {
                // TODO: fix animations
                return done();
                const queue = this[animation+'Queue'];
                const key = el.dataset.key;
                const delay = (this.enterQueue.size + this.leaveQueue.size) * (duration / 2);
                const enter = animation === 'enter';
                const target = el.parentElement;

                queue.add(key);

                TweenLite.fromTo(target, duration, {
                    marginTop: enter ? -target.clientHeight : 0,
                    opacity: enter ? 0 : 1,
                }, {
                    marginTop: enter ? 0 : -target.clientHeight,
                    opacity: enter ? 1 : 0,
                    delay,
                    onComplete() {
                        target.removeAttribute('style');
                        queue.delete(key);
                        done();
                    }
                });
            }
        },
    }
</script>

<style scoped>

    .game
    {
        margin: 20px 0;
    }

    .countdown
    {
        position: fixed;
        width: 100%;
        height: 100%;
        left: 0;
        top: 0;
        text-align: center;
        pointer-events: none;
        display: flex;
    }

    .countdown--value
    {
        margin: auto;
        font-size: 80vmin;
        line-height: 1;
        animation: countdown 1s infinite ease-in-out;
    }

    .submit
    {
        width: 100%;
        padding: 20px;
        border: none;
        border-radius: 4px;
        background-color: #5adc33;
        color: #fff;
        font-size: 30px;
    }



    .question-enter
    {
        opacity: 0;
        transform: translateY(10px);
    }

    .question-enter-active
    {
        transition: all .5s ease;
    }

    .submit-enter
    {
        opacity: 0;
        transform: translateY(10px);
    }

    .submit-leave-to
    {
        opacity: 0;
        transform: translateY(-10px);
    }

    .submit-enter-active,
    .submit-leave-active
    {
        transition: all .5s ease;
    }

    .submit-enter-active
    {
        transition-duration: .3s;
        transition-delay: .3s;
    }

    @keyframes countdown
    {
        0%
        {
            transform: scale(0);
            opacity: 0;
        }

        10%
        {
            opacity: 1;
        }

        100%
        {
            opacity: 0;
            transform: scale(2);
        }
    }
</style>