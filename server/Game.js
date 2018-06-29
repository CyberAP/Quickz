class Game {

    constructor({ name, rounds, scoreBoard }) {
        this.name = name || new Date().toLocaleDateString("ru-RU");
        this.rounds = rounds || [];
        this.scoreBoard = scoreBoard || {};
        this.currentRoundId = -1;
        this.roundStarted = false;
        this.answerVisible = false;
    }

    get currentRound() {
        return this.rounds[this.currentRoundId];
    }

    get publicData() {
        return {
            scoreBoard: this.scoreBoard,
            attempts: (this.currentRound && this.currentRound.attempts) ? this.currentRound.attempts : {},
            question: this.currentRound ? this.currentRound.question : '',
            answer:  this.currentRound && this.answerVisible ? this.currentRound.answer : '',
            countdownDate: this.countdownDate,
            roundStarted: this.roundStarted,
        }
    }

    get exportData() {
        return {
            name: this.name,
            rounds: this.rounds,
            scoreBoard: this.scoreBoard,
        }
    }

    startGame() {
        this.scoreBoard = {};
        this.currentRoundId = -1;
        this.nextRound();
    }

    prevRound() {
        if (this.currentRoundId < 1) return;
        this.currentRoundId--;
        this.roundStarted = false;
        this.answerVisible = false;
    }

    nextRound() {
        if (this.currentRoundId >= this.rounds.length-1) return;
        this.currentRoundId++;
        this.roundStarted = false;
        this.answerVisible = false;
    }

    startRound() {
        if (this.currentRoundId === -1) this.nextRound();
        if (this.currentRoundId < -1) return;
        this.currentRound.attempts = {};
        this.roundStarted = true;
        this.roundStartDate = new Date();
        if (this.currentRoundId === 0)
        {
            let date = new Date;
            this.countdownDate = date.setSeconds(date.getSeconds() + 5);
        }
    }

    toggleAnswer() {
        this.answerVisible = !this.answerVisible;
    }

    registerAttempt(participant) {
        if (!this.currentRound || this.currentRound.attempts[participant] || !this.roundStarted) return;

        this.currentRound.attempts[participant] = { date: (new Date() - this.roundStartDate) / 1000 };
    }

    score(participant) {
        if (!this.currentRound || !this.currentRound.attempts) return;

        const attempt = this.currentRound.attempts[participant];
        if (attempt.correct) return;

        if (!(participant in this.scoreBoard)) this.scoreBoard[participant] = 0;
        this.scoreBoard[participant]++;
        attempt.correct = true;
    }
}
export default Game;