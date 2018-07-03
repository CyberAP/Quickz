class Game {

    constructor({ name, rounds, teams }) {
        this.name = name || new Date().toLocaleDateString("ru-RU");
        this.rounds = rounds || [];
        this.teams = teams || {};
        this.currentRoundId = -1;
        this.roundStarted = false;
        this.answerVisible = false;
        this.gameEnded = false;
    }

    get currentRound() {
        return this.rounds[this.currentRoundId];
    }

    get publicData() {
        return {
            teams: this.teams,
            attempts: (this.currentRound && this.currentRound.attempts) ? this.currentRound.attempts : {},
            question: this.currentRound ? this.currentRound.question : '',
            answer:  this.currentRound && this.answerVisible ? this.currentRound.answer : '',
            countdownDate: this.countdownDate,
            roundStarted: this.roundStarted,
            gameEnded: this.gameEnded
        }
    }

    startGame() {
        this.gameEnded = false;
        this.currentRoundId = -1;
        this.nextRound();

        return this;
    }

    endGame() {
        this.gameEnded = true;

        return this;
    }

    prevRound() {
        if (this.currentRoundId < 1) return this;
        this.currentRoundId--;
        this.roundStarted = false;
        this.answerVisible = false;

        return this;
    }

    nextRound() {
        if (this.currentRoundId >= this.rounds.length-1) return this;
        this.currentRoundId++;
        this.roundStarted = false;
        this.answerVisible = false;

        return this;
    }

    startRound() {
        if (this.currentRoundId === -1) this.nextRound();
        if (this.currentRoundId < -1) return this;
        this.currentRound.attempts = {};
        this.roundStarted = true;
        this.roundStartDate = new Date();
        if (this.currentRoundId === 0)
        {
            let date = new Date;
            this.countdownDate = date.setSeconds(date.getSeconds() + 5);
        }

        return this;
    }

    toggleAnswer() {
        this.answerVisible = !this.answerVisible;

        return this;
    }

    registerAttempt(participant) {
        if (!this.currentRound || this.currentRound.attempts[participant] || !this.roundStarted) return;

        this.currentRound.attempts[participant] = { date: (new Date() - this.roundStartDate) / 1000 };

        return this;
    }

    score(participant) {
        if (!this.currentRound || !this.currentRound.attempts) return;

        const attempt = this.currentRound.attempts[participant];
        if (!attempt || 'correct' in attempt) return;
        attempt.correct = true;

        return this;
    }
}
export default Game;