<template>
    <div class="game">

        <div class="countdown" v-if="countdown > 0">
            <span class="countdown--value">{{countdown}}</span>
        </div>
        <div class="game--body">
            <transition-group
                    name="appear"
                    tag="div"
                    @enter="enter"
                    @leave="leave"
            >
                <div
                        v-if="!game.roundStarted"
                        key="prepare"
                        data-key="prepare"
                >
                    <h1>Prepare for the round</h1>
                </div>
            </transition-group>

            <transition-group
                    name="appear"
                    tag="div"
                    @enter="enter"
                    @leave="leave"
            >
                <h1
                        class="question"
                        key="question"
                        data-key="question"
                        v-if="game.question && countdown < 1 && game.roundStarted"
                >{{game.question}}</h1>
            </transition-group>

            <transition-group
                    name="appear"
                    tag="div"
                    @enter="enter"
                    @leave="leave"
            >
                <div
                        class="answer"
                        key="answer"
                        data-key="answer"
                        v-if="game.answer && countdown < 1 && game.roundStarted"
                >Answer: {{game.answer}}</div>
            </transition-group>

            <transition-group
                    name="appear"
                    tag="div"
                    @enter="enter"
                    @leave="leave"
            >
                <button
                        class="submit"
                        key="submit"
                        data-key="submit"
                        @click="dispatch('attempt')"
                        v-if="game.attempts && !(state.auth in game.attempts) && countdown < 1 && game.roundStarted && !presentation"
                >Got the answer!</button>
            </transition-group>

            <transition-group
                    name="appear"
                    tag="div"
                    @enter="enter"
                    @leave="leave"
            >
                <AttemptsList
                        v-if="game.attempts && countdown < 1 && game.roundStarted"
                        key="attempts"
                        data-key="attempts"
                        :controls="!presentation"
                ></AttemptsList>
            </transition-group>
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
            countdownDate() { return this.state.game.countdownDate; }
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