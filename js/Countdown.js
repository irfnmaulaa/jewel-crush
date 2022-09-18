import {app} from "./App.js";

class Countdown {
    constructor() {
        this.el = document.getElementById('countdown');
        this.numberEl = document.getElementById('countdown-number');
    }
    render() {

    }
    mount() {
        this.el.classList.add('active');
        this.start();
    }
    start() {
        this.number = 3;
        this.numberEl.innerText = this.number;
        const interval = setInterval(() => {
            if (this.number === 0) {
                app.setActiveScreen('game');
                clearInterval(interval);
                return;
            }
            this.number--;
            this.numberEl.innerText = this.number;
        }, 1000);
    }
    unMount() {
        this.el.classList.remove('active');
    }
}

export default Countdown;